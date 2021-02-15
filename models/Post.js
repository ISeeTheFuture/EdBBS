var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({
    title: { type: String, required: [true, 'Title is required.']},
    body: { type: String, required: [true, 'Content is required.']},
    author: { type:mongoose.Schema.Types.ObjectId, ref:'user', required:true }, // post.author와 mongoose의 user.id를 연결.
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;