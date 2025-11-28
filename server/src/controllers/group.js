const Group = require("../models/group");
const User = require("../models/user");

class GroupController {
  async create(req, res) {
    try {
      const { groupName } = req.body;
      const group = await Group.create({ groupName });
      return res.status(201).json(group);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showAll(req, res) {
    try {
      const groups = await Group.find({}).populate("members", "name avtUrl");
      return res.json(groups);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async showOne(req, res) {
    try {
      const group = await Group.findById(req.params.id).populate("members", "name avtUrl");
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      return res.json(group);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { groupName } = req.body;
      const group = await Group.findByIdAndUpdate(
        req.params.id,
        { groupName },
        { new: true, runValidators: true }
      );
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      return res.json(group);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const group = await Group.findByIdAndDelete(req.params.id);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      return res.json({ message: 'Group deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async addUser(req, res) {
    try {
      const { userId } = req.body;
      const groupId = req.params.id;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true }
      );

      return res.json({ group: updatedGroup, user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async removeUser(req, res) {
    try {
      const { userId } = req.body;
      const groupId = req.params.id;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }
      );

      return res.json({ group: updatedGroup, user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new GroupController();
