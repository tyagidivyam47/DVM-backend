const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const electionSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
  },
  candidates: [
    {
      name: {
        type: String,
      },
      sign: {
        type: String,
      },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Election", electionSchema);
