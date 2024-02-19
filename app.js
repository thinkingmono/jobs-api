//dotenv dependencie to use env variables.
require('dotenv').config();
//Import dependencie async errors handler.
require('express-async-errors');

//Server creation
const express = require('express');
const app = express();

//Security dependecies declaration.
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//Import db connection routine.
const connectDB = require('./db/connect')
//Import authentication middleware.
const authMiddleware = require('./middleware/authentication')
//Import authentication routes
const authRouter = require('./routes/auth')
//Import jobs routes
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Enable app.set in case of proxy use on Heroku.
app.set('trust proxy', 1);
//Rate limit configuration.
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

// Security packages
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Server listening port setting.
const port = process.env.PORT || 3000;

//Database connection routine declaration
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

//run start routine
start();
