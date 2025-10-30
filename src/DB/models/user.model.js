import { model, Schema } from "mongoose";

// Schema
const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: function () {
        if (this.phoneNumber) {
          // this is to make it dynamic
          // if there is phoneNumber then the email in optional
          return false;
        }
        return true;
      },
      // unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.userAgent == "google") {
          return false;
        }
        return true;
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        if (this.email) return false;
        return true;
      },
      // unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: Date,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    userAgent: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    credentialUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Virtual fields
schema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

schema.virtual("fullName").set(function (value) {
  const [firstName, lastName] = value.split(" ");
  this.firstName = firstName;
  this.lastName = lastName;
});

schema.virtual("age").get(function () {
  return new Date().getFullYear() - new Date(this.dob).getFullYear();
});

// Model
export const User = model("user", schema);
