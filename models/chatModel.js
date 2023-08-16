import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({

  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },

  message: {
    type: String,
    trim: true,
    required: true
  },
  
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
