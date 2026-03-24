import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const { name, userId } = req.body;
  try {
    const room = await Room.create({ name, createdBy: userId });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: "Room name already exists" });
  }
};