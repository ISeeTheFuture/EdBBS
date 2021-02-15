var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util.js');

// Index 
router.get('/', function (req, res) {
    Post.find({})
        .populate('author') // populate : user.id값을 author에 생성.
        .sort('-createdAt')
        .exec(function (err, posts) {
            if (err) { return res.json(err); }
            res.render('posts/index', { posts: posts });
        });
});

// New
router.get('/new', function (req, res) {
    var post = req.flash('post')[0]||{};
    var errors = req.flash('errors')[0]||{};
    res.render('posts/new', {post:post, errors:errors});
});

// create
router.post('/', function (req, res) {
    req.body.author = req.user._id; // req.user는 로그인시 passport에서 자동 생성
    Post.create(req.body, function (err, post) {
        if (err) {
            req.flash('post', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/posts/new');
        }
        res.redirect('/posts');
    });
});

// show
router.get('/:id', function (req, res) { // /:id에 get 요청이 오는경우
    Post.findOne({ _id: req.params.id }) // 해당 req의 id를 찾아
        .populate('author') // author에 넣어
        .exec(function (err, post) { // 게시글을 보여준다.
            if (err) { return res.json(err); }
            res.render('posts/show', { post: post });
    });
});

// edit
router.get('/:id/edit', function (req, res) {
    var post = req.flash('post')[0]; // 처음 들어오는 경우 분기 처리가 필요하므로 {}로 빈 객체를 넣지 않는다.
    var errors = req.flash('errors')[0]||{};
    if(!post) { // post가 없으면 처음 들어온 경우이므로, 기존의 값을 form에 넣는다.
        Post.findOne({ _id: req.params.id }, function (err, post) {
            if (err) { return res.json(err); }
            res.render('posts/edit', { post: post, errors:errors });
        });
    } else { // post가 있으면 오류가 있어 update에서 돌아온 경우이다.
        post._id = req.params.id;
        res.render('posts/edit', { post:post, errors:errors });
    }
});

// update
router.put('/:id', function (req, res) {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({ _id: req.params.id }, req.body, {runValidators:true}, function (err, post) { // findOneAndUpdate 함수에서 runValidators 기본값은 false이므로 true로.
        if (err) {
            req.flash('post', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/posts/'+req.params.id+'/edit'); // edit으로 돌아간다.
        }
        res.redirect("/posts/" + req.params.id);
    });
});

// destroy
router.delete('/:id', function (req, res) {
    Post.deleteOne({ _id: req.params.id }, function (err) {
        if (err) { return res.json(err); }
        res.redirect('/posts');
    });
});

module.exports = router;