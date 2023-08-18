import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generatateOtp from "../utils/generateOtp.js";
import generateToken from "../utils/generateToken.js";
import verifyEmail from "../utils/verifyMail.js";


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password)) && user.isVerified) {

    if(!user.isBlocked){
     const token = generateToken(res, user._id);

     console.log({
      token : token,
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      isAdmin: user.isAdmin,
      email: user.email,
    }, 'USERRRRRRRRRRRRRRRRRRRRRRRRRRR');

    res.status(201).json({
      token : token,
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      isAdmin: user.isAdmin,
      email: user.email,
    });
    }else{
      res.status(401);
      throw new Error("Can not login, you are blocked");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});



const registerUser = asyncHandler(async (req, res) => {
  const { fName, lName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    fName,
    lName,
    email,
    password,
    otp: generatateOtp(),
  });



  if (user) {
    verifyEmail(user.email, user.otp);
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      otp: user.otp
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};



const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (user) {
    user.fName = req.body.fName || user.fName;
    user.lName = req.body.lName || user.lName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fName: updatedUser.fName,
      lName: updatedUser.lName,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const validateOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
    if (user.otp === req.body.otp) {
      user.isVerified = true;

      const updatedUser = await user.save();

      res.status(201).json({
        _id: updatedUser._id,
        fName: updatedUser.fName,
        lName: updatedUser.lName,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        isBlocked: updatedUser.isBlocked,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Otp");
    }
  }
});


// To reset password email verification 


const resetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });

  if (user) {
    // let otp =  generatateOtp()
    // verifyEmail(user.email, otp);

    res.status(201).json({
      _id: user._id,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email");
  }
});


const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id)

  if(user){
    user.password = req.body.password;

     await user.save();
     res.status(201).json('Password Reset Succefully')
  }else{
    res.status(400);
    throw new Error("User not found");
  }
})



export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  validateOtp,
  resetPassword,
  updatePassword,
};
