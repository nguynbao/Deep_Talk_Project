const mongoose = require("mongoose");
const crypto = require("crypto");

const Game = require("../models/game");
const Group = require("../models/group");
const Topic = require("../models/topic");
const Question = require("../models/question");
const User = require("../models/user");

function complexShuffle(arr) {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1); 
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1) {
    const offset = crypto.randomInt(0, result.length);
    if (offset !== 0) {
      return result.slice(offset).concat(result.slice(0, offset));
    }
  }

  return result;
}

function shuffleQuestions(questions) {
  const ids = questions.map((q) => q._id);
  return complexShuffle(ids);
}

function shufflePlayers(members) {
  return complexShuffle(members);
}

class GameController {
  // BẮT ĐẦU GAME
  async start(req, res) {
    try {
      const { groupId, topicId } = req.body;

      // topicId đặc biệt: lấy tất cả topic
      const useAllTopics = topicId === "all";

      // 1. Kiểm tra group
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      if (!group.members || group.members.length === 0) {
        return res.status(400).json({ error: "Group has no members" });
      }

      // 2. Kiểm tra topic (nếu không phải chế độ "all topics")
      if (!useAllTopics) {
        if (!mongoose.isValidObjectId(topicId)) {
          return res.status(400).json({ error: "Invalid topic id" });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
          return res.status(404).json({ error: "Topic not found" });
        }
      }

      // 3. Lấy danh sách câu hỏi
      const questions = await Question.find(
        useAllTopics ? {} : { topic: topicId }
      );
      if (!questions.length) {
        return res
          .status(404)
          .json({ error: "No questions for this topic" });
      }

      // 4. Random câu hỏi
      const remainingQuestions = shuffleQuestions(questions);

      // 5. Random thứ tự người chơi
      const shuffledPlayers = shufflePlayers(group.members);

      // 6. Có thể random luôn chỉ số bắt đầu (không bắt buộc, vì nextTurn giờ random rồi)
      const initialNextPlayerIndex =
        shuffledPlayers.length > 0
          ? crypto.randomInt(0, shuffledPlayers.length)
          : 0;

      // 7. Tạo game
      const game = await Game.create({
        group: groupId,
        topic: useAllTopics ? null : topicId,
        players: shuffledPlayers,
        remainingQuestions,
        askedQuestions: [],
        nextPlayerIndex: initialNextPlayerIndex,
        status: "active",
      });

      return res.status(201).json({
        game,
        questions,
      });
    } catch (err) {
      console.error("[GameController.start] Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // LƯỢT TIẾP THEO – RANDOM NGƯỜI CHƠI MỖI LƯỢT
  async nextTurn(req, res) {
    try {
      const { id } = req.params;

      // 1. Lấy game
      const game = await Game.findById(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (game.status === "completed") {
        return res.status(400).json({ error: "Game already completed" });
      }

      if (!game.remainingQuestions.length) {
        game.status = "completed";
        await game.save();
        return res.status(400).json({ error: "No remaining questions" });
      }

      // 2. Lấy câu hỏi tiếp theo (đã random sẵn trong remainingQuestions)
      const questionId = game.remainingQuestions.shift();
      game.askedQuestions.push(questionId);

      // 3. RANDOM NGẪU NHIÊN NGƯỜI CHƠI CHO LƯỢT NÀY
      let playerId = null;
      if (game.players && game.players.length > 0) {
        const randomIndex = crypto.randomInt(0, game.players.length);
        playerId = game.players[randomIndex];

        // Nếu muốn theo dõi cho vui thì có thể lưu lại index vừa random
        game.nextPlayerIndex = randomIndex;
      }

      // 4. Nếu đã hết câu hỏi thì set completed
      if (!game.remainingQuestions.length) {
        game.status = "completed";
      }

      await game.save();

      // 5. Lấy chi tiết câu hỏi + người chơi
      const [question, player] = await Promise.all([
        Question.findById(questionId).populate("topic"),
        playerId ? User.findById(playerId) : null,
      ]);

      return res.json({
        gameId: game._id,
        status: game.status,
        question,
        player,
        remainingQuestionCount: game.remainingQuestions.length,
      });
    } catch (err) {
      console.error("[GameController.nextTurn] Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new GameController();
