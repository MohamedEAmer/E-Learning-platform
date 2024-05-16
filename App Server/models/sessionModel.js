const {Schema , model} = require('mongoose')

const sessionSchema = new Schema({
    name: { type: String , required: true},
    description: { type: String , required: true},
    data: { type: String , required: true},
    class: { type: Schema.Types.ObjectId , ref: "Course"},
    course:{type: Schema.Types.String,  ref:"Course"},
    creator: { type: Schema.Types.ObjectId , ref: "User"},
    instructor:{type: Schema.Types.String,  ref:"User"},
    media: { type: String , required: true },
    mediadata: { type: Object, required: true }
} , {timestamps: true})


module.exports = model("Session" , sessionSchema)