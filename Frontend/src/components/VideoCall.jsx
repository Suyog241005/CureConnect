import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const VideoCall = () => {
    const [roomId, setRoomId] = useState("");
    const [inCall, setInCall] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    useEffect(() => {2
        socket.on("ready", () => {
            console.log("Both users in room, creating offer...");
            createOffer();
        });

        socket.on("offer", async (offer) => {
            console.log("Received offer, setting up connection...");
            if (!peerConnectionRef.current) setupPeerConnection();

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
        });

        socket.on("answer", (answer) => {
            console.log("Received answer, setting remote description...");
            peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", (candidate) => {
            console.log("Received ICE candidate, adding...");
            peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("room-full", () => {
            alert("Room is full. Try another room.");
        });

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("ready");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
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
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            if (!peerConnectionRef.current) setupPeerConnection();

            stream.getTracks().forEach(track => {
                peerConnectionRef.current?.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const setupPeerConnection = () => {
        console.log("Setting up Peer Connection...");
        peerConnectionRef.current = new RTCPeerConnection(servers);

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { roomId, candidate: event.candidate });
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            console.log("Remote stream received...");
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };
    };

    const createOffer = async () => {
        console.log("Creating offer...");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            {!inCall ? (
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold">Join a Video Call</h2>
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="mt-3 p-2 w-full rounded-md text-black"
                    />
                    <button onClick={joinRoom} className="mt-4 bg-blue-500 px-4 py-2 rounded-md">
                        Join
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-lg">Room ID: {roomId}</h2>
                    <div className="flex space-x-4">
                        <video ref={localVideoRef} autoPlay muted className="w-48 h-48 rounded-lg bg-black" />
                        <video ref={remoteVideoRef} autoPlay className="w-48 h-48 rounded-lg bg-black" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCall;