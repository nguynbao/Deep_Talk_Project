const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    next();
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: 'Internal error'})
    
});

module.exports = app;
