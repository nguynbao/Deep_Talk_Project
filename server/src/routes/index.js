const { model } = require('mongoose')
const userRouter = require('./user')
const groupRouter = require('./group')
const questionRouter = require('./question')
const gameRouter = require('./game')
const topicRouter = require('./topic')

function route(app){
     app.use('/users', userRouter)
     app.use('/groups', groupRouter)
     app.use('/questions', questionRouter)
     app.use('/games', gameRouter)
     app.use('/topics', topicRouter)
}
module.exports = route
