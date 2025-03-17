import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './styles/chat.css';
import { useSelector } from 'react-redux';
import { UserCircle2, MessageSquare, Send, ArrowRight } from 'lucide-react';

const Chat = () => {
    const { user } = useSelector((state) => state.user);
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [joined, setJoined] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5001/chat', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket.on('room-full', () => {
            alert('Room is full. Please try another room.');
            setJoined(false);
        });

        return () => {
            socket.off('message');
            socket.off('room-full');
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = (e) => {
        e.preventDefault();
        if (!roomId.trim()) return;
        socket.emit('join-room', roomId);
        setJoined(true);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit('user-message', { roomId, text: message });
        setMessage('');
    };

    return (
        <div className="chat-container min-h-[600px]">
            {!joined ? (
                <form onSubmit={joinRoom} className="join-form">
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                        required
                    />
                    <button type="submit">Join Room</button>
                </form>
            ) : (
                <div className="max-w-4xl mx-auto h-[600px] p-4 flex flex-col">
                    <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">Telemedicine Chat</h2>
                                    <p className="text-sm text-blue-100">Room: {roomId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-blue-100">
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        {user.specialization && ` - ${user.specialization}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === socket.id ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === socket.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <p className="text-xs mt-1 opacity-75">
                                            {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                // <div className="chat-box">
                //     <div className="messages">
                //         {messages.map((msg, index) => (
                //             <div
                //                 key={index}
                //                 className={`message ${msg.sender === socket.id ? 'sent' : 'received'}`}
                //             >
                //                 <p>{msg.text}</p>
                //             </div>
                //         ))}
                //         <div ref={messagesEndRef} />
                //     </div>
                //     <form onSubmit={sendMessage} className="message-form">
                //         <input
                //             type="text"
                //             value={message}
                //             onChange={(e) => setMessage(e.target.value)}
                //             placeholder="Type a message..."
                //         />
                //         <button type="submit">Send</button>
                //     </form>
                // </div>
            )}
        </div>
    );
};

export default Chat;