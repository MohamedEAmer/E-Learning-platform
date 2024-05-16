const {Router} = require('express')

const authMiddleware = require('../middleware/authMiddleware')

const  {createCourse,getAllCourse,getCourse,getUserCourses,buyCourse,editCourse,deleteCourse} = require('../controllers/coursesController')
const router = Router()



router.post ('/',authMiddleware,createCourse)//create course - next session
router.get ('/',getAllCourse)// get coursers (student)
router.get ('/:id',getCourse)//get single course data (option if instractor update) coursers (student)
// router.get ('/categories/:category',getCatCourses)// courses in the same supject
router.get ('/users/:id',getUserCourses)// get user (My courses) // dashboard
router.post('/:id',authMiddleware,buyCourse)
router.patch ('/:id',authMiddleware,editCourse)// edit post - next session
router.delete ('/:id',authMiddleware,deleteCourse)// delete post - next session




module.exports = router