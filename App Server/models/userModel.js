const { Schema , model} = require('mongoose')

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    avatar: { type: String},
    courses: { type: Number, default:0},
    accType: { type: String , default:'instructor'},
    coursesIn: [{
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
        }
      }]
})

module.exports = model('User',userSchema);