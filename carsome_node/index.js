const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const controller = require('./controller');

app.use(express.json());
app.use(cors());

app.get('/getSlots', controller.getSlots);
app.post('/bookSlot', controller.bookASlot);


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));