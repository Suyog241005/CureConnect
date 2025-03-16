import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.1.100:5001"); // Replace with your server IP

export default function VideoCall() {
    const [roomId, setRoomId] = useState("");
    const [inCall, setInCall] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    useEffect(() => {
        socket.on("user-joined", async () => {
            console.log("Another user joined, creating offer...");
            await createOffer();
        });

        socket.on("offer", async ({ offer }) => {
            console.log("Received offer, creating answer...");
            if (!peerConnectionRef.current) await setupPeerConnection(); // Ensure setup before using
            
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
        });

        socket.on("answer", async ({ answer }) => {
            console.log("Received answer");
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            console.log("Received ICE candidate");
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, [roomId]);

    const joinRoom = async () => {
        if (!roomId) return alert("Enter a Room ID!");
        setInCall(true);
        await setupLocalStream();
        socket.emit("join-room", roomId);
    };

    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Permission denied! Please allow camera and microphone access.");
        }
    };

    const setupPeerConnection = async () => {
        if (!peerConnectionRef.current) {
            peerConnectionRef.current = new RTCPeerConnection(servers);
        }

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { roomId, candidate: event.candidate });
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            console.log("Receiving remote stream");
            if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, localStreamRef.current);
            });
        } else {
            console.error("Local stream is not set up yet!");
        }
    };

    const createOffer = async () => {
        await setupPeerConnection();
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    return (
        <div>
            {!inCall ? (
                <div>
                    <h2>Join a Video Call</h2>
                    <input type="text" placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                    <button onClick={joinRoom}>Join</button>
                </div>
            ) : (
                <div>
                    <h2>Room: {roomId}</h2>
                    <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px", border: "1px solid black" }}></video>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px", border: "1px solid red" }}></video>
                </div>
            )}
        </div>
    );
}