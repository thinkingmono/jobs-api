// const { CustomAPIError } = require('../errors')
//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes')

//Error handler middleware
const errorHandlerMiddleware = (err, req, res, next) => {

  //Set custom error default values.
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //If error name is ValidationError
  if (err.name === 'ValidationError') {
    // console.log(Object.values(err.errors));
    //Set customError message with an array of fields with error. Join as an unique string through comma.
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    //Set customError status code with 400 code (bad request error)
    customError.statusCode = 400;
  }

  //If error code is 11000.
  if (err.code && err.code === 11000) {
    //Set customError message with duplicate field message.
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    //Set customError status code with 400 code (bad request error)
    customError.statusCode = 400
  }

  //If error name is cast error
  if (err.name === 'CastError') {
    //Set customError message with no item found message.
    customError.msg = `No item found with id: ${err.value}`
    //Set customError status code with 404 code (not found error)
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

//Export error handler middleware.
module.exports = errorHandlerMiddleware
