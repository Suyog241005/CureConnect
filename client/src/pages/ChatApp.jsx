import { FaUserMd, FaUser, FaPaperPlane } from 'react-icons/fa';
import doctor1 from "../assets/doctor1.webp"; // Adjust the path based on file location
import React from 'react';
import "./ChatApp.css"
function ChatUI({ messages, isLoading, newMessage, setNewMessage, handleSendMessage }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 h-screen w-full bg-cover bg-center bg-no-repeat "   style={{ backgroundImage: `url(${doctor1})`}}
>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center space-x-2">
            <FaUserMd className="text-2xl" />
            <div>
              <h1 className="text-xl font-bold">Dr. Smith</h1>
              <p className="text-sm opacity-90">General Physician</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'doctor' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'doctor' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'doctor' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  {message.sender === 'doctor' ? (
                    <FaUserMd className="text-white text-sm" />
                  ) : (
                    <FaUser className="text-white text-sm" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'doctor'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Sending...' : 'Send'}</span>
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatUI;