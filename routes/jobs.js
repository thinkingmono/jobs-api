//Express router creation
const express = require('express')
const router = express()

//Import job controllers.
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs')

//Creating job routes.
router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

//Export jobs router.
module.exports = router