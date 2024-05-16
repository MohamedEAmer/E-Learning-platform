const Course = require('../models/courseModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require('uuid')
const HttpError = require('../models/errorModel')

// POST , api/courses , protected
const createCourse = async (req,res,next) => {
    try {
        let { title , category , description , duration } = req.body;
        if(!title||!category||!description||!duration||!req.files){
            return next(new HttpError("Fill in all fields and choose thumbnail" , 422));
        }
        const courseExists = await Course.findOne({title: title,instructor: req.user.name});
        // to use this in the session checker
        if(courseExists) {
            return next(new HttpError('Try new Title for your course ',422))
        }
        const {thumbnail} =  req.files;
        if(thumbnail.size > 2000000){
            return next(new HttpError('Thumbnail too big , file should be less than 2mb.'))
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0]+ uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
            if(err){
                return next(new HttpError(err))
            }else{
                const newCourse = await Course.create({title, category, description, duration,thumbnail: newFilename,instructor: req.user.name ,creator: req.user.id})
                if(!newCourse){
                    return next(new HttpError('Course could not be changed.', 422))
                }
                const currentUser = await User.findById(req.user.id);
                const userCourseCount = currentUser.courses + 1;
                await User.findByIdAndUpdate(req.user.id, {courses:userCourseCount})

                res.status(201).json(newCourse)
            }

        })
        
    } catch (error) {
        return next(new HttpError(error));
    }
}


// Get , api/courses/users/id , unprotected  (student)
const getUserCourses = async (req,res,next) => {
    try {
        const {id} =req.params;
        const user = await User.findById(id)
        if (!user) {
            return next(new HttpError('User not found',422))
        }
        if(user.accType === 'student'){
            const enrolled = user.coursesIn
            const courses = await Course.find({_id: {$in: enrolled} }).sort({updatedAt: -1})
            res.status(200).json(courses)
        }
        if(user.accType === 'instructor'){
            const courses = await Course.find({creator: id}).sort({createdAt: -1})
            res.status(200).json(courses)
        }
    } catch (error) {
        return next(new HttpError(error));
    }

    // this will get the login user and render the courses automatically according to his role
}



const buyCourse =async (req,res,next)=>{
    try {
        let { name , email ,title , instructor } = req.body;
        console.log(req.body)
        if(!title||!name||!email){
            return next(new HttpError("Fill in all fields and enter a valid card information" , 422));
        }

        const student = await User.findOne({ name: name, email: email });

        if(!student){
            return next(new HttpError("Enter your User name and your E-mail" , 422));
        }
        const course = await Course.findOne({title:title,instructor:instructor})

        if(!course){
            return next(new HttpError("Please try againe later" , 422));
        }

        await student.coursesIn.push(course._id)
        await student.save()
        console.log(student)

        res.status(200).json(student)
        
    } catch (error) {
        return next(new HttpError('You can not buy this course',422))
    }
}

const getAllCourse = async (req,res,next) => {
    try {

        const allCourse  = await Course.find().sort({updatedAt: -1})
        if(!allCourse){
            return next(new HttpError('Courses not Found.',404));
        }
        res.status(200).json(allCourse)
    } catch (error) {
        return next(new HttpError(error));
    }
}


// Get , api/courses/:id , unprotected  
const getCourse = async (req,res,next) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId)
        if(!course){
            return next(new HttpError('Course not Found.',404));
        }
        res.status(200).json(course)
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Patch , api/courses/:id , protected
const editCourse = async (req,res,next) => {
    try {
        let fileName;
        let newFilename;
        const courseId = req.params.id;
        let {title , category , description , duration} = req.body;
        if(!title || !category || !description.length > 12 || !duration){
            return next(new HttpError("Fill in all Fields.",422));
        }
        const oldCourse = await Course.findById(courseId);
        if(req.user.id == oldCourse.creator){
            if(!req.files){
                updatedCourse = await Course.findByIdAndUpdate(courseId,{title, category , description ,duration} , {new : true})
            } else {
                fs.unlink(path.join(__dirname,'..','uploads',oldCourse.thumbnail),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })

                const { thumbnail } = req.files;
                if(thumbnail.size > 2000000){
                    return next(new HttpError("Thumbnail too big. Should be less than 2mb"));
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0]+ uuid() + '.' + splittedFilename[splittedFilename.length - 1]
                thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })
            
                updatedCourse = await Course.findByIdAndUpdate(courseId,{title , category , description , duration, thumbnail: newFilename},{new: true})
            }
        }
        if(!updatedCourse){
            return next(new HttpError('Could Not update Course.' , 400));
        }
        res.status(200).json(updatedCourse)
    } catch (error) {
        return next(new HttpError('Could Not update Course.' , 400));
    }
}

// DELETE , api/courses/:id , protected
const deleteCourse = async (req,res,next) => {
    try {
        const courseId = req.params.id;
        if(!courseId){
            return next(new HttpError('Courses unavailable.' , 400));
        }
        const course = await Course.findById(courseId);
        const fileName =course?.thumbnail;
        if(req.user.id == course.creator){
            fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                } else {
                    await Course.findByIdAndDelete(courseId);
                    const currentUser = await User.findById(req.user.id);
                    const userCourseCount = currentUser?.courses-1;
                    await User.findByIdAndUpdate(req.user.id , {courses: userCourseCount})
                    res.json(`Course ${courseId} deleted successfully.`)
                }
            })
        } else {
            return next(new HttpError('You can not delet that Course' , 403));
        }
    } catch (error) {
        return next(new HttpError('Course can not be deleted' , 403));
    }
}



module.exports={createCourse,getCourse,getAllCourse,getUserCourses,buyCourse,editCourse,deleteCourse}