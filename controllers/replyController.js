import asyncHandler from "express-async-handler";
import Reply from "../models/replyModel.js";
import Question from "../models/questionModel.js";



const addReply = asyncHandler(async (req, res) => {
  try {
    const { questionId, userId, text } = req.body;

    const newReply = await Reply.create({
      question: questionId,
      user: userId,
      text: text,
    });

    console.log(newReply, 'am new reply');

    if (newReply) {
      const updtaedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { $push: { replies: newReply._id } },
        { new: true }
      );

      console.log(updtaedQuestion, 'am new updtaedQuestion');

      if (updtaedQuestion) {
        res.status(201).json("Reply submited successfully");
      } else {
        throw new Error("Error");
      }
    }
  } catch (error) {
    console.log(error);
  }
})



// To update Reply ///

const updateReply = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const reply = await Reply.findById(id);

    if (!reply) throw new Error("Reply not found");

    reply.text = req.body.text || reply.text;

    await reply.save();
    res.json("Reply updated");
  } catch (error) {
    console.log(error);
  }
});



/// To delete Reply ///

const deleteReply = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const reply = await Reply.findByIdAndDelete(id);

    if (!reply) throw new Error("Reply not found");
      
    res.json("Reply deleted");
  
  } catch (error) {
    console.log(error);
  }
});



export { addReply, updateReply, deleteReply };
