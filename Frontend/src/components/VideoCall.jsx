import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5001");

export default function VideoCall() {
    const [roomId, setRoomId] = useState("");
    const [inCall, setInCall] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({}); // Store multiple remote video refs
    const peerConnections = useRef({}); // Store multiple peer connections
    const localStreamRef = useRef(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const { user } = useSelector(state => state.user) || {};

    useEffect(() => {
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("disconnect", () => console.log("Socket disconnected"));

        socket.on("room-full", () => {
            alert("Room is full. Try another room.");
            setInCall(false);
        });

        socket.on("user-joined", async (newUserId) => {
            console.log(`User ${newUserId} joined, creating offer...`);
            await createOffer(newUserId);
        });

        socket.on("offer", async ({ senderId, offer }) => {
            console.log(`Received offer from ${senderId}, creating answer...`);
            if (!peerConnections.current[senderId]) {
                setupPeerConnection(senderId);
            }
            await peerConnections.current[senderId].setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnections.current[senderId].createAnswer();
            await peerConnections.current[senderId].setLocalDescription(answer);
            socket.emit("answer", { roomId, answer, senderId });
        });

        socket.on("answer", ({ senderId, answer }) => {
            console.log(`Received answer from ${senderId}`);
            peerConnections.current[senderId]?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", ({ senderId, candidate }) => {
            console.log(`Received ICE candidate from ${senderId}`);
            peerConnections.current[senderId]?.addIceCandidate(new RTCIceCandidate(candidate));
        });

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("room-full");
        };
    }, [roomId]);

    const joinRoom = async () => {
        if (!roomId) return alert("Enter a Room ID!");
        console.log(`Joining room: ${roomId}`);
        setInCall(true);
        socket.emit("join-room", roomId);
        await setupLocalStream();
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

    const setupPeerConnection = (peerId) => {
        console.log(`Setting up Peer Connection with ${peerId}...`);
        const peerConnection = new RTCPeerConnection(servers);

        peerConnections.current[peerId] = peerConnection;

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { roomId, senderId: socket.id, candidate: event.candidate });
            }
        };

        peerConnection.ontrack = (event) => {
            console.log(`Receiving remote stream from ${peerId}`);
            if (!remoteVideoRefs.current[peerId]) {
                remoteVideoRefs.current[peerId] = document.createElement("video");
                remoteVideoRefs.current[peerId].autoPlay = true;
                remoteVideoRefs.current[peerId].playsInline = true;
                remoteVideoRefs.current[peerId].classList.add("remote-video");
                document.getElementById("remote-videos").appendChild(remoteVideoRefs.current[peerId]);
            }
            remoteVideoRefs.current[peerId].srcObject = event.streams[0];
        };

        localStreamRef.current.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStreamRef.current);
        });
    };

    const createOffer = async (peerId) => {
        if (!peerConnections.current[peerId]) {
            setupPeerConnection(peerId);
        }

        const offer = await peerConnections.current[peerId].createOffer();
        await peerConnections.current[peerId].setLocalDescription(offer);
        socket.emit("offer", { roomId, offer, senderId: socket.id });
    };

    return (
        <div className="video-call-container">
            {!inCall ? (
                <div>
                    <h2>Join a Video Call</h2>
                    <input type="text" placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                    <button onClick={joinRoom}>Join</button>
                </div>
            ) : (
                <div>
                    <h2>Room: {roomId}</h2>
                    <video ref={localVideoRef} autoPlay playsInline muted></video>
                    <div id="remote-videos"></div>
                </div>
            )}
        </div>
    );
}