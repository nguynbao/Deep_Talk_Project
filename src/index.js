const app = require('./app');
// const db = require('./config/db');
const PORT = process.env.PORT || 300;

app.get('./', (req, res) => {
    res.send("Hello world");
});
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});
