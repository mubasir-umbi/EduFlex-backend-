import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'



const addCategory = asyncHandler(async(req, res) => {
    const {imageUrl} = req.body
    let name = req.body.name
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    const catExist = await Category.findOne({name})

    if(catExist){
        res.status(401)
        throw new Error('Category alredy exist')
    }

    const category = await Category.create({
        name,
        imageUrl,
    })

    console.log(category);

    if (category) {
        res.status(201).json({
          _id: category._id,
          name: category.name
        });
      } else {
        res.status(400);
        throw new Error("Invalid category data");
      }
})



const loadCategoryData = asyncHandler(async (req, res) => {

    const categoryData = await Category.find()
    if(categoryData){
        res.json(categoryData)
    }else{
        throw new Error('No category found')
    }
})



const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.body.id)

    if(category){
        res.json('Category deleted')
    }else{
        throw new Error('category not found')
    }
})



// Category update function 


const updateCategory = asyncHandler(async (req, res) => {

    let name = req.body?.name
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    const categoryExist = await Category.findOne({name})

    if(categoryExist){
        res.status(400)
        throw new Error('Category alredy exist')
    }

    const category = await Category.findById(req.body.id)

    if (category) {
        category.name = 
        req.body.name?.charAt(0).toUpperCase() + req.body.name?.slice(1).toLowerCase() 
        || category.name;
        category.imageUrl = req.body.imageUrl || category.imageUrl;
    
        const updatedCategory = await category.save();
    
        res.json({
          _id: updatedCategory._id,
          fName: updatedCategory.name,
          imageUrl: updatedCategory.imageUrl,
        });
      } else {
        res.status(404);
        throw new Error("Category not found");
      }
})




export{
    addCategory,
    loadCategoryData,
    deleteCategory,
    updateCategory,
}