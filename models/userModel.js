import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    
    lName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    
    otp: {
      type: String,
  },

  isAdmin: {
      type: Boolean,
      required: true,
      default: false
  },
  
  isBlocked: {
      type: Boolean,
      required: true,
      default: false
  },

  isVerified: {
      type: Boolean,
      required: true,
      default: false
  },

  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Middleware to delete otp field if user is verified
userSchema.pre('save', async function (next) {
  if (this.isVerified && this.isModified('isVerified')) {
    this.otp = undefined;
  }
  next();
});

// // Middleware to delete user if not verified after 10 minutes
// userSchema.pre('save', async function (next) {
//   if (!this.isVerified && this.isNew) {
//     this.verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
//   }
//   next();
// });

// // Middleware to check and delete user if not verified after 10 minutes
// userSchema.pre('save', async function (next) {
//   if (!this.isVerified && this.isModified('isVerified') && !this.isNew) {
//     const currentTime = new Date();
//     if (this.verificationExpiresAt && this.verificationExpiresAt <= currentTime) {
//       await this.model('User').deleteOne({ _id: this._id });
//     }
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);

export default User;
