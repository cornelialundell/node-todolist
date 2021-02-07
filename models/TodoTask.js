const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
content: {
type: String,
required: true
},
checked: {
type: Boolean,
default: false
},
class: {
    type: String,
    default: ''
},
date: {
type: Date,
default: Date.now
}
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);