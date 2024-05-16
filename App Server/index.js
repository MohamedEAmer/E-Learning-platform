const express = require('express')
const cors = require('cors')
const {connect} = require('mongoose')
require('dotenv').config()
const upload = require('express-fileupload')
const userRoutes = require('./routes/userRoutes')
const coursesRoutes = require('./routes/coursesRoutes')
const sessionsRoutes = require('./routes/sessionsRoutes')

const {notFound, errorHandler} = require('./middleware/errorMiddleware')



const app = express();

app.use(express.json({extended: true}))// the shape of the data send in the api url 
app.use(express.urlencoded({extended: true}))// another shape of the data sent in the api url
app.use(cors({credentials: true , origin: 'http://localhost:3000'}))
app.use(upload())
app.use('/uploads', express.static(__dirname+'/uploads'))

app.use('/api/users' , userRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/sessions', sessionsRoutes)


app.use(notFound)
app.use(errorHandler)



connect(process.env.MONGO_URL).then(app.listen(7070, () => console.log(`Server running on port ${process.env.PORT}`))).catch(err=>{console.log})

