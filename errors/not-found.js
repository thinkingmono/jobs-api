//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes');
//Import Parent Custom API Error class.
const CustomAPIError = require('./custom-api');

//Extend bad request error (404) from custom api parent class.
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
