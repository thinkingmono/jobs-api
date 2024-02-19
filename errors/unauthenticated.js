//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes');
//Import Parent Custom API Error class.
const CustomAPIError = require('./custom-api');

//Extend bad request error (401) from custom api parent class.
class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
