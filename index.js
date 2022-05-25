const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log(process.env);

const port = process.env.PORT || 5000;
const app = express();

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is Running');
})
app.listen(port, () => {
    console.log('Server Listening to port', port);
})