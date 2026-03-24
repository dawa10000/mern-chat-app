import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  const fetchMessages = async () => {
    const res = await axios.get(`http://localhost:5000/api/messages/${roomId}`);
    setMessages(res.data);
  };

  useEffect(() => {
    socket.emit("join-room", roomId);

    const handler = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!text) return;

    const message = {
      sender: {
        _id: userId,
        username: username,
      },
      roomId,
      text,
      createdAt: new Date(),
    };

    await axios.post("http://localhost:5000/api/messages", {
      sender: userId,
      roomId,
      text,
    });

    socket.emit("send-message", message);
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-50 p-4">
      <button
        onClick={() => navigate("/rooms")}
        className="mb-4 text-purple-700 font-semibold hover:text-purple-900 transition"
      >
        ← Back to Rooms
      </button>

      <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-3 bg-white rounded-2xl shadow-inner">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === userId;
          return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl shadow break-words relative ${isMe
                    ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                    : "bg-gradient-to-br from-pink-300 to-pink-500 text-white"
                  }`}
              >
                <div className="font-semibold mb-1">
                  {msg.sender?.username || msg.senderName || "User"}
                </div>
                <div className="mb-1">{msg.text}</div>
                <div className="text-xs text-gray-200 text-right">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;