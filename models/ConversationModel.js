

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
    
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
