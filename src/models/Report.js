const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson ID is required"],
    },
    reporterEmail: {
      type: String,
      required: [true, "Reporter email is required"],
      lowercase: true,
      trim: true,
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reports from the same user on the same lesson
reportSchema.index({ lessonId: 1, reporterEmail: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
