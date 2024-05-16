const {Router} = require('express')

const authMiddleware = require('../middleware/authMiddleware')

const  {createSession , getCourseSessions , getSession , editSession , deleteSession} = require('../controllers/sessionsController')

const router = Router()


router.post ('/course/:id',authMiddleware,createSession)//create session
router.get('/course/:id',getCourseSessions)// get course contant
// router.get ('/',getSessions)// get Sessions (student)
router.get ('/:id',getSession)//get single Sessions data (option if instractor update) Sessions (student/watch)
router.patch ('/:id',authMiddleware,editSession)// edit session
router.delete ('/:id',authMiddleware,deleteSession)// delete session







module.exports = router