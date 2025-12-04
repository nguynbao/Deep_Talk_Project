import axios from "axios";

const API_BASE_URL = process.env.SERVER || "http://localhost:8000";
const USERS_API = `${API_BASE_URL}/users`;
const GROUP_API = `${API_BASE_URL}/groups`;
const QUESTIONS_API = `${API_BASE_URL}/questions`;
const GAME_API = `${API_BASE_URL}/games`;
const TOPIC_API = `${API_BASE_URL}/topics`;

const unwrap = (promise) => promise.then((res) => res.data);

// Users
const createUserAPI = ({ name, avtUrl }) =>
  unwrap(axios.post(`${USERS_API}/`, { name, avtUrl }));
const getUsersAPI = () => unwrap(axios.get(USERS_API));
const getUserAPI = (id) => unwrap(axios.get(`${USERS_API}/${id}`));
const updateUserAPI = (id, payload) =>
  unwrap(axios.put(`${USERS_API}/${id}`, payload));
const deleteUserAPI = (id) => unwrap(axios.delete(`${USERS_API}/${id}`));

// Groups
const createGroupAPI = (groupName) =>
  unwrap(axios.post(`${GROUP_API}/`, { groupName }));
const getGroupsAPI = () => unwrap(axios.get(GROUP_API));
const getGroupAPI = (id) => unwrap(axios.get(`${GROUP_API}/${id}`));
const updateGroupAPI = (id, groupName) =>
  unwrap(axios.put(`${GROUP_API}/${id}`, { groupName }));
const deleteGroupAPI = (id) => unwrap(axios.delete(`${GROUP_API}/${id}`));
const addUserToGroupAPI = (groupId, userId) =>
  unwrap(axios.post(`${GROUP_API}/${groupId}/users`, { userId }));
const removeUserFromGroupAPI = (groupId, userId) =>
  unwrap(axios.post(`${GROUP_API}/${groupId}/users/remove`, { userId }));

// Questions
const createQuestionAPI = ({ content, topic }) =>
  unwrap(axios.post(`${QUESTIONS_API}/`, { content, topic }));
const getQuestionsAPI = () => unwrap(axios.get(QUESTIONS_API));
const getQuestionAPI = (id) => unwrap(axios.get(`${QUESTIONS_API}/${id}`));
const updateQuestionAPI = (id, payload) =>
  unwrap(axios.put(`${QUESTIONS_API}/${id}`, payload));
const deleteQuestionAPI = (id) => unwrap(axios.delete(`${QUESTIONS_API}/${id}`));
const getQuestionsByTopicAPI = ({ topicId, topicName }) =>
  unwrap(
    axios.get(`${QUESTIONS_API}/filter`, {
      params: { topicId, topicName },
    })
  );

// Topics
const getTopicsAPI = () => unwrap(axios.get(TOPIC_API));
const createTopicAPI = (topicName) =>
  unwrap(axios.post(`${TOPIC_API}/`, { topicName }));

// Games
const startGameAPI = ({ groupId, topicId }) =>
  unwrap(axios.post(`${GAME_API}/start`, { groupId, topicId }));
const nextTurnAPI = (gameId) => unwrap(axios.post(`${GAME_API}/${gameId}/next`));

export {
  createUserAPI,
  getUsersAPI,
  getUserAPI,
  updateUserAPI,
  deleteUserAPI,
  createGroupAPI,
  getGroupsAPI,
  getGroupAPI,
  updateGroupAPI,
  deleteGroupAPI,
  addUserToGroupAPI,
  removeUserFromGroupAPI,
  createQuestionAPI,
  getQuestionsAPI,
  getQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
  getQuestionsByTopicAPI,
  getTopicsAPI,
  createTopicAPI,
  startGameAPI,
  nextTurnAPI,
};
