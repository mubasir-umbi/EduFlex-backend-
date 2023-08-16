import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'


const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
  },


  addressLine: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }, 
  
  isVerified: {
    type: Boolean,
    default: false
  }, 

  otpVerified: {
    type: Boolean,
    default: false
  }, 

  otp: {
    type: String,
  },

  isRejected: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  about: {
    type: String,
    required: true
  },



  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});



// Match user entered password to hashed password in database
registrationSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
registrationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


registrationSchema.pre('save', async function (next) {
  if (this.otpVerified && this.isModified('otpVerified')) {
    this.otp = undefined;
  }
  next();
});


const Tutor = mongoose.model('Tutor', registrationSchema);

export default Tutor;


