const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tone: {
      type: String,
      required: [true, "Tone is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: Number,
      default: 5,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    accessLevel: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },
    author: {
      email: {
        type: String,
        required: [true, "Author email is required"],
        lowercase: true,
        trim: true,
      },
      name: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
      },
      photo: {
        type: String,
        default: "",
      },
    },
    likes: {
      type: [String],
      default: [],
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
lessonSchema.index({ "author.email": 1 });
lessonSchema.index({ category: 1, tone: 1 });
lessonSchema.index({ title: "text" });

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
