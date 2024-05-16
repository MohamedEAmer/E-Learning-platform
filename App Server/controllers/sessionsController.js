const Course = require('../models/courseModel')
const User = require('../models/userModel')
const Session = require('../models/sessionModel')
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require('uuid')
const HttpError = require('../models/errorModel')




// POST , api/sessions/course/id(course id) , protected
const createSession = async (req,res,next) => {
    try {
            
        const courseId = req.params.id;
        const currentCourse = await Course.findById(courseId)
        const course = currentCourse.title
        let { name , data ,description } = req.body;
        if(!currentCourse){
            return next(new HttpError("This Session needs a Course to be created" , 422));
        }
        if(!name||!data||!description||!req.files){
            return next(new HttpError("Fill in all fields and choose Media data" , 422));
        }
        const sessionExists = await Session.findOne({name: name,instructor: req.user.name});
        // to use this in the session checker
        if(sessionExists) {
            return next(new HttpError('Try new Name for your Session ',422))
        }
        const {media} =  req.files;
        if(media.size > 20000000){
            return next(new HttpError('Media too big , file should be less than 20mb.'))
        }

        let fileName = media.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0]+ uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        media.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
            if(err){
                return next(new HttpError(err))
            }else{

                const newSession = await Session.create({name, description, data,class: courseId ,course: course ,media: newFilename , mediadata:media,instructor: req.user.name ,creator: req.user.id})
                if(!newSession){
                    return next(new HttpError('Session could not be created.', 422))
                }
                const courseSessionsCount = currentCourse.sessions + 1;
                await Course.findByIdAndUpdate(courseId, {sessions:courseSessionsCount})

                currentCourse.sessionsIn.push(newSession.id)
                currentCourse.save()
                res.status(201).json(newSession)
            }

        })
    
    } catch (error) {
        return next(new HttpError(error));
    }
}




// Get , api/sessions/courses/id(of a course) , unprotected  (student)
const getCourseSessions = async (req,res,next) => {
    try {
        const {id} =req.params;
        const course = await Course.findById(id)
        if (!course) {
            return next(new HttpError('Course not found',422))
        }

        const contant = course.sessionsIn
        const sessions = await Session.find({_id: {$in: contant} }).sort({updatedAt: 1})
        res.status(200).json(sessions)

    } catch (error) {
        return next(new HttpError(error));
    }

    // this will get the login user and render the courses automatically according to his role
}



// Get , api/sessions/:id , unprotected  

const getSession = async (req,res,next) => {
    try {
        const sessionId = req.params.id;
        const session = await Session.findById(sessionId)
        if(!session){
            return next(new HttpError('Session not Found.',404));
        }
        res.status(200).json(session)
    } catch (error) {
        return next(new HttpError(error));
    }
}


// Patch , api/sessions/:id , protected
const editSession = async (req,res,next) => {
    try {
        let fileName;
        let newFilename;
        const sessionId = req.params.id;
        let {name , description , data } = req.body;
        if(!name || !description.length > 12 ||!data ){
            return next(new HttpError("Fill in all Fields.",422));
        }
        const oldSession = await Session.findById(sessionId);
        if(req.user.id == oldSession.creator){
            if(!req.files){
                updatedSession = await Session.findByIdAndUpdate(sessionId,{name, description} , {new : true})
            } else {
                fs.unlink(path.join(__dirname,'..','uploads',oldSession.media),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })

                const { media } = req.files;
                if(media.size > 20000000){
                    return next(new HttpError("Media too big. Should be less than 20mb"));
                }
                fileName = media.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0]+ uuid() + '.' + splittedFilename[splittedFilename.length - 1]
                media.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })
            
                updatedSession = await Session.findByIdAndUpdate(sessionId,{name , description ,data, mediadata:media,media: newFilename},{new: true})
            }
        }
        if(!updatedSession){
            return next(new HttpError('Could Not update Session.' , 400));
        }
        res.status(200).json(updatedSession)
    } catch (error) {
        return next(new HttpError('Could Not update Session.' , 400));
    }
}


// DELETE , api/sessions/:id , protected
const deleteSession = async (req,res,next) => {
    try {
        const sessionId = req.params.id;
        if(!sessionId){
            return next(new HttpError('Session unavailable.' , 400));
        }
        const session = await Session.findById(sessionId);
        const fileName =session?.media;
        if(req.user.id == session.creator){
            fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                } else {
                    await Session.findByIdAndDelete(sessionId);
                    const currentCourse = await Course.findById(session.class);
                    const courseSessionsCount = currentCourse?.sessions-1;
                    await Course.findByIdAndUpdate(session.class , {sessions: courseSessionsCount})
                    res.json(`Session ${sessionId} deleted successfully.`)
                }
            })
        } else {
            return next(new HttpError('You can not delet that Session' , 403));
        }
    } catch (error) {
        return next(new HttpError('Session can not be deleted' , 403));
    }
}




module.exports={createSession , getCourseSessions , getSession , editSession , deleteSession}