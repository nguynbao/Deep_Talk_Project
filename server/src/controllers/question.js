const Question = require("../models/question");
const Topic = require("../models/topic");
const mongoose = require("mongoose");

class QuestionController {
  async create(req, res) {
    try {
      const { content, topic } = req.body;

      if (topic) {
        const topicExists = await Topic.exists({ _id: topic });
        if (!topicExists) {
          return res.status(400).json({ error: "Topic not found" });
        }
      }

      const question = await Question.create({ content, topic });
      return res.status(201).json(question);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showAll(req, res) {
    try {
      const questions = await Question.find({}).populate("topic", "topicName");
      return res.json(questions);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showOne(req, res) {
    try {
      const question = await Question.findById(req.params.id).populate("topic", "topicName");
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.json(question);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { content, topic } = req.body;

      if (topic) {
        const topicExists = await Topic.exists({ _id: topic });
        if (!topicExists) {
          return res.status(400).json({ error: "Topic not found" });
        }
      }

      const question = await Question.findByIdAndUpdate(
        req.params.id,
        { content, topic },
        { new: true, runValidators: true }
      );
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.json(question);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.json({ message: "Question deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async filter(req, res) {
    try {
      const { topicId, topicName } = req.query;

      if (!topicId && !topicName) {
        return res
          .status(400)
          .json({ error: "topicId hoặc topicName là bắt buộc" });
      }

      let topicFilter = null;

      if (topicId && topicId !== "all") {
        if (!mongoose.isValidObjectId(topicId)) {
          return res.status(400).json({ error: "Topic id không hợp lệ" });
        }

        const exists = await Topic.exists({ _id: topicId });
        if (!exists) {
          return res.status(404).json({ error: "Topic không tồn tại" });
        }
        topicFilter = topicId;
      } else if (topicName && topicName !== "all") {
        const topic = await Topic.findOne({ topicName });
        if (!topic) {
          return res.status(404).json({ error: "Topic không tồn tại" });
        }
        topicFilter = topic._id;
      }

      const conditions = topicFilter ? { topic: topicFilter } : {};
      const questions = await Question.find(conditions).populate(
        "topic",
        "topicName"
      );
      return res.json(questions);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new QuestionController();
