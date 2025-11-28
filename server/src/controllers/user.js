const User = require('../models/user');

class UserController {
  async create(req, res) {
    try {
      const { name, avtUrl } = req.body;
      const user = await User.create({ name, avtUrl});
      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showAll(req, res) {
    try {
      const users = await User.find({});
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showOne(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { name, avtUrl } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, avtUrl },
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ message: 'User deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
