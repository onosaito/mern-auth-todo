const winston = require('winston');
const error = require('./middleware/error');
const cors = require('cors');
const todos = require("./routes/todos");
const users = require("./routes/users");
const auth = require("./routes/auth")
const express = require("express");
const mongoose = require("mongoose")

winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyprint: true }),
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
)

process.on('unhandledRejection', (ex) => {
  throw ex;
})

winston.add(new winston.transports.File({ filename: 'logfile.log' }));

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/todos", todos);
app.use("/api/users", users);
app.use("/api/auth", auth)

app.use(error)

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log("MongoDB connection established..."))
.catch(err => console.error("MongoDB connection failed"))

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
