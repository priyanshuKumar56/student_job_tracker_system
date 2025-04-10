const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
jobSchema.index({ company: 1, role: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ appliedDate: -1 });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
