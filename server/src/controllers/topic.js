const Topic = require("../models/topic");

class TopicController {
  async showAll(req, res) {
    try {
      const topics = await Topic.find({});
      return res.json(topics);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const { topicName } = req.body;
      const topic = await Topic.create({ topicName });
      return res.status(201).json(topic);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TopicController();
