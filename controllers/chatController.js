import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Conversation from "../models/ConversationModel.js";

// To create new message

const createChat = asyncHandler(async (req, res) => {
  try {
    console.log(conversation, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
    const { conversation, sender, message } = req.body;

    let newChat = new Chat({ conversation, sender, message });
    await newChat.save();

    // newChat = await newChat.populate('sender', '_id')
    // newChat = await newChat.populate('message')
    console.log(newChat, "::::::::::::::::::::::::");
    res.status(201).json(newChat);
  } catch (error) {
    console.log(error);
  }
});

/// Get all messages for a specific conversation

const getChat = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;

    const messages = await Chat.find({ conversation: id })
      .populate("sender", "-password")
      .populate("message");

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const loadChats = asyncHandler(async (req, res) => {
  const id = req.query.id;

  console.log(id, '////////////////////////////////');

  const chatList = await Conversation.find({
    participants: {
      $in: [id],
    },
  });

  const participants = chatList.map((user) => {
    return { participants: user.participants, id: user._id };
  });

  const users = []

  for (const el of participants) {
    for (let i = 0; i < el.participants.length; i++) {
      if (el.participants[i].toString() !== id) {
        console.log(el.participants[i]);
        const user = await User.findById(el.participants[i], "fName email");
        users.push({ user: user, conversation: el.id });
      }
    }
  }
 console.log(users, 'usersssss');
  res.json(users);
});

export { createChat, getChat, loadChats };
