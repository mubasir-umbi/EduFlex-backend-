import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import asyncHandler from "express-async-handler";


// To submit new review


const submitReview = asyncHandler(async (req, res) => {
  try {
    const { courseId, userId, review, rating } = req.body;

    const newReview = await Review.create({
      user: userId,
      course: courseId,
      review: review,
      rating: rating,
    });

    const course = await Course.findById(courseId);

    if (course) {
      course.totalRating += parseInt(rating);
      course.reviewCount++;
      course.rating = course.totalRating / course.reviewCount;
    }

    await course.save();

    if (newReview) {
      res.status(201).json("success");
    } else {
      throw new Error("Error ocuured");
    }
  } catch (error) {
    console.log(error);
  }
});


// To fetch all course reviews


const getReviews = asyncHandler(async (req, res) => {
  try {
    const reviewsData = await Review.find();
    if (reviewsData) {
      res.json(reviewsData);
    } else {
      throw new Error("Error occured");
    }
  } catch (error) {
    console.log(error);
  }
});


// To fetch sigle course reviews


const getCourseReviews = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const reviewsData = await Review.find({ course: id }).populate("user");
    if (reviewsData) {
      res.json(reviewsData);
    } else {
      throw new Error("Error occured");
    }
  } catch (error) {
    console.log(error);
  }
});


//update review and rating


const updateReview = asyncHandler(async (req, res) => {

  try {
    const id = req.query.id
    const { review, rating } = req.body;

    const reviewData = await Review.findById(id).populate("course");
    if (!reviewData) {
      throw new Error("Review not found");
    }

    const prevRating = reviewData.rating;
    const courseId = reviewData.course._id;

    reviewData.review = review || reviewData.review;
    reviewData.rating = rating || reviewData.rating;

    await reviewData.save();

    const course = await Course.findById(courseId);
    if (course) {
      course.totalRating = course.totalRating - prevRating + reviewData.rating;
      course.rating = course.totalRating / course.reviewCount;

      await course.save();
    }

    res.json("Review updatated.");
  } catch (error) {
    console.error(error);
    console.log(error);
  }
});


/// To delete single Course review


const deleteReview = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;

    const deletedReview = await Review.findByIdAndDelete(id).populate('course');
    console.log(deletedReview, 'am delete reviewwwwwwwwwwww');

    if (deletedReview) {
      const prevRating = deletedReview.rating;
      const courseId = deletedReview.course._id;

      const course = await Course.findById(courseId);

      course.totalRating = course.totalRating - prevRating;
      course.reviewCount--;
      course.rating = course.reviewCount > 0 ? course.totalRating / course.reviewCount : 0;

      await course.save(); 

      res.status(204).json("success");
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});


export {
  submitReview,
  getReviews,
  getCourseReviews,
  updateReview,
  deleteReview,
};
