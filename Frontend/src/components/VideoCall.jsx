import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5001"); // Ensure backend is running

export default function VideoCall() {
    const [roomId, setRoomId] = useState("");
    const [inCall, setInCall] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const { user } = useSelector(state => state.user) || {};

    // Handle WebSocket Events
    useEffect(() => {
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("disconnect", () => console.log("Socket disconnected"));
        socket.on("connect_error", (err) => console.error("Socket connection error:", err));

        socket.on("ready", () => {
            console.log("Both users in room, creating offer...");
            createOffer();
        });

        socket.on("offer", async (offer) => {
            console.log("Received offer, setting remote description...");
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
            setInCall(false);
        });

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("ready");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("room-full");
        };
    }, [roomId]);

    // Join Room and Setup Stream
    const joinRoom = async () => {
        if (!roomId) return alert("Enter a Room ID!");
        console.log(`Joining room: ${roomId}`);
        setInCall(true);
        socket.emit("join-room", roomId);
        await setupLocalStream();
    };

    // Request Camera & Microphone Permissions
    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log("Local stream obtained:", stream);
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            if (!peerConnectionRef.current) setupPeerConnection();
            stream.getTracks().forEach(track => {
                console.log("Adding track to peer connection:", track);
                peerConnectionRef.current?.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Permission denied! Please allow camera and microphone access.");
        }
    };

    // Setup Peer Connection
    const setupPeerConnection = () => {
        console.log("Setting up Peer Connection...");
        peerConnectionRef.current = new RTCPeerConnection(servers);

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate:", event.candidate);
                socket.emit("ice-candidate", { roomId, candidate: event.candidate });
            } else {
                console.log("No more ICE candidates.");
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            console.log("Remote stream received:", event.streams[0]);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };
    };

    // Create Offer for Peer Connection
    const createOffer = async () => {
        console.log("Creating offer...");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    return (
        <div className="flex flex-col items-center justify-center mb-8 h-full min-h-96 text-white">
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
                <div className="flex flex-col w-full mx-8 h-[calc(100vh-12rem)]">
                    <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Room: {roomId}</h2>
                            <p className="text-sm text-gray-500">
                                {user ? `Connected as ${user.name} (${user.role})` : "User not found"}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 flex">
                        <div className="flex-1 relative">
                            <div className="bg-black h-full rounded-lg overflow-hidden">
                                <video ref={remoteVideoRef} className="h-full w-full object-cover" autoPlay playsInline></video>
                            </div>

                            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] rounded-lg overflow-hidden shadow-lg border-2 border-white">
                                <video ref={localVideoRef} className="h-full w-full object-cover" autoPlay playsInline muted></video>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};