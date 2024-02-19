//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes');
//Import Parent Custom API Error class.
const CustomAPIError = require('./custom-api');

//Extend bad request error (400) from custom api parent class.
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
