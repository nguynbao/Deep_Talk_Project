const {default:mongoose} = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
     content: { type: String, required: true},
     topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
})
module.exports = mongoose.model('Question', questionSchema);