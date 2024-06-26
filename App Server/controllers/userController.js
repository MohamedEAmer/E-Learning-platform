const HttpError = require('../models/errorModel')
const User = require('../models/userModel')
const Course = require('../models/courseModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require('uuid')// add some id after a name
// const nodemailer = require('nodemailer')
// const Mailgen = require('mailgen')
const sendInvitationEmail = require('../middleware/emailMiddleware')
const otpGenerator = require('otp-generator')



// POST , api/users/regisster , unprotected
const registerUser = async (req, res ,next)=>{
    try {
        const{name , email, password ,password2} = req.body;
        if(!name ||!email ||!password){
            return next(new HttpError('Fill in All fields. ',400))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({email: newEmail});

        if(emailExists) {
            return next(new HttpError('Email Already Exists. ',400))
        }

        if((password.trim().length < 6)){
            return next(new HttpError('Password should be at least 6 characters. ',400))
        }

        if(password != password2) {
            return next(new HttpError('Passwords do not match. ',400))
        } 

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password , salt);
        const newUser = await User.create({name , email: newEmail , password: hashedPass })
        res.status(200).json(newUser)

    } catch (error) {
        return next(new HttpError('User Registeration Failed',400))
        
    }
}


// POST , api/users/invite , unprotected
const createUser = async (req, res ,next)=>{
    try {
        const { userEmail , name , course} = req.body;
        const password = await otpGenerator.generate(9)
        req.body.password = password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password , salt);
        if(!userEmail||!name||!course){
            return next(new HttpError('Please Try To enter Valid inputs. ',400))
        }
        const newEmail = userEmail.toLowerCase()
        const emailExists = await User.findOne({email: newEmail});
        const myCourse = await Course.find({title: course , creator: req.user.id})
        const courseID = myCourse[0]._id.toString();
        if(emailExists && emailExists.coursesIn.some(course => course._id.toString() === courseID)) {
            return next(new HttpError('Email Already Exists and Enrolled in this Course. ',400))
        }
        if(emailExists && !emailExists.coursesIn.includes(myCourse[0]._id)){
            emailExists.coursesIn.push(myCourse[0]._id)
            await emailExists.save()  
            console.log(emailExists)
            return res.status(200).json(emailExists)          
        }
        const newUser = await User.create({name: name, email: newEmail , password: hashedPass , accType: 'student'})
        newUser.coursesIn.push(myCourse[0]._id)
        newUser.save()
        await sendInvitationEmail(userEmail , name , password , course)
        res.status(200).json(newUser)

    } catch (error) {
        return next(new HttpError('User Invitation Failed',400))
        
    }
}




// POST , api/users/login , unprotected
const loginUser = async (req, res ,next)=>{
    try {
        const{email, password } = req.body;
        if(!email ||!password){
            return next(new HttpError('Fill in All fields. ',400))
        }

        const newEmail = email.toLowerCase()

        const user = await User.findOne({email:newEmail})
        if(!user){
            return next(new HttpError('Invalid Inputs.',400))
        }
        const comparePass = await bcrypt.compare(password , user.password)
        if(!comparePass){
            return next(new HttpError('Wrong password.',400))
        }

        const {_id: id, name , accType}= user;

        const token = jwt.sign({id,name}, process.env.JWT_SECRET,{expiresIn:"1d"})

        res.status(200).json({token, id , name ,accType}) // try to res all (user) data not only id , name
        //res.status(200).json({token,user}) // this is more better (Try it Later)
    } catch (error) {
        return next(new HttpError('Login failed . Please Enter the Email and Password. ',400))
    }
}


// GET , api/users/:id , protected
const getUser = async (req, res ,next)=>{
    try {
        const {id} =  req.params;
        const user = await User.findById(id).select('-password');

        if(!user){
            return next(new HttpError('User not found.',400))
        }
    
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// POST , api/users/change-avatar , protected
const changeAvatar = async (req, res ,next)=>{
    try {
        if(!req.files.avatar){
            return next(new HttpError('Please choose an image', 400))
        }
        
        const user = await User.findById(req.user.id)

        if(user.avatar){
            fs.unlink(path.join(__dirname,'..','uploads',user.avatar),(err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avatar} = req.files;
        if(avatar.size > 500000){
            return next(new HttpError('Profile picture too big , Should be less than 500Kb', 400))
        }

        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0]+ uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        avatar.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
            if(err){
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id,{avatar: newFilename},{new: true})
            if(!updatedAvatar){
                return next(new HttpError('Avatar could not be changed.', 400))
            }
            res.status(200).json(updatedAvatar)
        })
    } catch (error) {
        return next(new HttpError(err))
    }


}


// POST , api/users/edit-user , protected
const editUser= async (req, res ,next)=>{
    try {
        const{name , email, currentPassword ,newPassword,confirmNewPassword} = req.body;
        if(!name ||!email ||!currentPassword||!newPassword){
            return next(new HttpError('Fill in All fields. ',400))
        }
        const user = await User.findById(req.user.id);

        if(!user){
            return next(new HttpError('User not found.',403))
        }

        const emailExist = await User.findOne({email});

        if(emailExist && emailExist._id != req.user.id){
            return next(new HttpError('Email already exist.',400))
        }

        const validateUserPassword = await bcrypt.compare(currentPassword , user.password);
        if(!validateUserPassword){
            return next(new HttpError('Invalid current password',400))
        }

        if(newPassword !== confirmNewPassword){
            return next(new HttpError('New password Do not match.',400))
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword , salt);

        const newInfo = await User.findByIdAndUpdate(req.user.id ,{name , email , password: hash},{new: true})

        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error)) 
    }

}





















module.exports = { registerUser , createUser ,loginUser , getUser , changeAvatar , editUser }


// module.exports = { registerUser , loginUser ,getUser, changeAvatar , editUser , getAuthors}