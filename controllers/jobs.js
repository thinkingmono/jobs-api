//Import request status codes handler dependencie
const { StatusCodes } = require('http-status-codes')
//Import Job mongoose data model
const Job = require('../models/Job')
//Import error handler classes.
const { NotFoundError, BadRequestError } = require('../errors')


//Get all jobs route handler.
const getAllJobs = async (req, res) => {
    //Get all jobs crated by the user is consulting. Sort it by job's created at date.
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    //Return response with 200 status code, with an object containing jobs array, and jobs count based in jobs array length.
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

//Get single job route handler.
const getJob = async (req, res) => {
    //Destructure anidado. From request destructure user and params. From user destructure userId and from params destructure id and assign it jobId alias.
    const { user: { userId }, params: { id: jobId } } = req
    //Find the user's job based in job id and user id.
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    //If there's no job, throw not found error (404)
    if (!job) {
        throw new NotFoundError(`No work with id ${jobId}`)
    }
    //Return response with job info and status code 200.
    res.status(StatusCodes.OK).json({ job })
}

//Create a job route handler.
const createJob = async (req, res) => {
    //Create a createdBy attribute into request body, set equal to current session userId.
    req.body.createdBy = req.user.userId
    //Create new job document into mongo db job collection. Pass request body.
    const job = await Job.create(req.body)
    //Return response with status code 201 and just created job info.
    res.status(StatusCodes.CREATED).json(job)
}

//Update job route handler.
const updateJob = async (req, res) => {
    //Destructure anidado. From request destructure user and params. From user destructure userId and from params destructure id and assign it jobId alias.
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req
    //Check if company or position are an empty string. If it is, throw bad request error (400)
    if (company === '' || position === '') {
        throw new BadRequestError('Company and position cannot be empty')
    }
    //Look for the job in mongodb ocllection and update it, using Job data model. Pass job id, user id, request body with data you wish to update and config flags to return new document and run mongoose field validators.
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

    //If there is no job found throw not found error (404)
    if (!job) {
        throw new NotFoundError(`No work with id ${jobId}`)
    }

    //Return response with recently updateed job and status code 200.
    res.status(StatusCodes.OK).json({ job })
}

//Delete job route handler.
const deleteJob = async (req, res) => {
    //Destructure user and params from request. Then destructure user id and job id from user and params.
    const { user: { userId }, params: { id: jobId } } = req

    //Find job in mongo db collection, then remove it. Pass job id and user which created.
    const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId })

    //If there's no job, throw not found error (404)
    if (!job) {
        throw new NotFoundError(`No work with id ${jobId}`)
    }
    //Return response with confirmation msg and ok status code (200)
    res.status(StatusCodes.OK).send('Job Removed Successfully')
}

//Export controllers.
module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }