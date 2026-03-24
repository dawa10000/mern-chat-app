import Message from "../models/Message.js";

// ✅ Get all messages (sorted + populated)
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 }); // 👈 important

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create message
export const createMessage = async (req, res) => {
  try {
    const { sender, roomId, text } = req.body;

    const message = await Message.create({
      sender,
      roomId,
      text,
    });

    // 👇 return populated message (VERY IMPORTANT)
    const populatedMessage = await message.populate("sender", "username");

    res.json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};