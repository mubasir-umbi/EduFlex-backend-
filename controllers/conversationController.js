import asyncHandler from "express-async-handler";
import Conversation from '../models/ConversationModel.js'
import User from "../models/userModel.js";



// const createConversation = asyncHandler(async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.body;
//     const newConversation = new Conversation({
//       participants: [senderId, receiverId],
//     });

//     await newConversation.save();

//     return res.status(201).json({
//       message: "Conversation created successfully",
//       conversation: newConversation,
//     });
//   } catch (error) {
//     console.error("Error :", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });




// const getConversation = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.query.id;

//     const conversation = await Conversation.find({
//       participants: { $in: [userId] },
//     });

//     const conversationUser = await Promise.all(
//       conversation.map(async (conv) => {
//         const receiverId = conv.participants.find(
//           (parti) => parti.toString() !== userId
//         );
//         const receiver = await User.findById(receiverId);
//         return {
//           receiver: {
//             receiver: receiver.fName,
//             lastName: receiver.lName,
//             email: receiver.email,
//           },
//           conversationId: conv._id,
//         };
//       })
//     );

//     return res.status(200).json(conversationUser);
//   } catch (error) {
//     console.error("Error :", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });


const createConversation = asyncHandler(async (req, res) => {
  const {senderId, recieverId } = req.body;

  if (!senderId && !recieverId) {
    console.log("param not sent with request");
    return res.sendStatus(400);
  }

  // Find a chat between the current user and the target user
  const existingChat = await Conversation.findOne({
    participants: { $all: [senderId, recieverId] },
  }).populate("participants", "-password");

  if (existingChat) {
    res.json(existingChat);
  } else {

    const chatData = {
      participants: [senderId, recieverId],
    };

    try {
      const createdChat = await Conversation.create(chatData);
      const fullChat = await Conversation.findOne({ _id: createdChat._id }).populate(
        "participants",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


export { createConversation, };
