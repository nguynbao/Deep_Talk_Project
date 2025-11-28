const {default: mongoose} = require("mongoose")
const Schema = mongoose.Schema

const Topic = new Schema({
     topicName: { type: String, enum: ['family', 'friend', 'love', 'all']},
});
module.exports = mongoose.model('Topic', Topic);