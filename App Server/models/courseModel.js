const {Schema , model} = require('mongoose')

const courseSchema = new Schema({
    title: { type: String , required: true},
    category: { type: String , enum: ["Math","English","Science","History","Arabic","Geography","French","Arts"],
        message: "VALUE is not supported"},
    description: { type: String , required: true},
    intro: { type: String , required: true},
    creator: { type: Schema.Types.ObjectId , ref: "User"},
    instructor:{type: Schema.Types.String,  ref:"User"},
    thumbnail: { type: String , required: true},
    contant:{type: Schema.Types.String,  ref:"Session"},
    duration:{ type: Number, required: true},
    price:{ type: Number, required: true},
    sessions: { type: Number, default:0},
    sessionsIn: [{
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Session',
        }
      }]
} , {timestamps: true})


module.exports = model("Course" , courseSchema)