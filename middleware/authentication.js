//Declare Json Web Token dependencie
const jwt = require('jsonwebtoken');
//Authentication custom error import
const { UnauthenticatedError } = require('../errors');

//Authentication middleware to run before job routes.
const authMiddleware = async (req, res, next) => {
    //Store authorization header wich contains user's bearer token.
    const authHeader = req.headers.authorization;

    //If there are no token or if it does not begin with Bearer, throw authentication error (401)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Invalid Authentication')
    }

    //Split bearer keyword from token string, then store token into token const.
    const token = authHeader.split(' ')[1];

    try {
        //Verify jason web token using jsonwebtoken dependencie. Pass token with env JWT_Secret decode variable.
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //Set request user atribute with userId and user name from decoded token.
        req.user = { userId: payload.userId, name: payload.name }
        // console.log(req.user);
        //Run next middleware in route.
        next()
    } catch (error) {
        //Throw authentication error (401)
        throw new UnauthenticatedError('Invalid Authentication')
    }
}

//Export uth middleware.
module.exports = authMiddleware