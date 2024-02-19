//Import error handler classes.
const { UnauthenticatedError, BadRequestError } = require('../errors')
//Import User mongoose data model
const User = require('../models/User')
//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes')

//Register route controller
const register = async (req, res) => {
    //Capture request body wich contains name, email and pwd. Pass it into User.create method to create document into mongodb collection.
    const user = await User.create({ ...req.body })
    //Generate user's jason web token using createJWT method from User model. Store it into token const.
    const token = user.createJWT()
    //Send response with 201 code and return object with user's name and token.
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

//Login route controller
const login = async (req, res) => {
    //Destructure email and password from request body.
    const { email, password } = req.body

    //Check if there are an email and a password. If not throw bad request error (400)
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    //Send request to to find user in mongodb collection. Pass object with email.
    const user = await User.findOne({ email })

    //Check if there is an user. If not, throw authentication error (401)
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    //Check if user's password is correct, comparing with User's model method comparePassword.
    const isPasswordCorrect = await user.comparePassword(password);

    //If password is incorrect, throw an authentication error (401)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    //Create user's token using User's model method.
    const token = user.createJWT();
    //Return object with user's name and token. Status code 200.
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })

}

//Export register and login controllers.
module.exports = { register, login }