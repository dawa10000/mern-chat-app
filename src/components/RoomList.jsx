import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName) return alert("Enter a room name");
    try {
      await axios.post("http://localhost:5000/api/rooms", { name: roomName, userId });
      setRoomName("");
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || "Error creating room");
    }
  };

  const handleJoin = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">
            Chat Rooms
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Logout
          </button>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="New room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 p-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleCreateRoom}
            className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-r-full font-semibold"
          >
            Create
          </button>
        </div>

        <ul className="space-y-3">
          {rooms.map((room) => (
            <li
              key={room._id}
              onClick={() => handleJoin(room._id)}
              className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-2xl cursor-pointer shadow-lg transform transition hover:scale-105 hover:shadow-2xl"
            >
              {room.name}
            </li>
          ))}
        </ul>

        {rooms.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">
            No rooms available. Create one!
          </p>
        )}
      </div>
    </div>
  );
}

export default RoomList;