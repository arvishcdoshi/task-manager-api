const mongoose = require('mongoose')

// ref: 'User' equates to foreign key as in relational databases

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
   },
    completed: {
        type: Boolean,
        default: false
   },
   owner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task