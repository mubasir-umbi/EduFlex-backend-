import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category
