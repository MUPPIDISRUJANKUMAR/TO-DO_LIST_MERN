const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;