const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: false },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    remainingQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    askedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    nextPlayerIndex: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
