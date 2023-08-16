import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', 
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;
