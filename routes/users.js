var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util.js');

// Index
// Todo... 관리자 전용으로 바꿀 것.
router.get('/', util.isLoggedin, function (req, res) {
    User.find({})
        .sort({ username: 1 }) // -1 : 내림차순
        .exec(function (err, users) {
            if (err) { return res.json(err); }
            res.render('users/index', { users: users });
        });
});

// New
router.get('/new', function (req, res) {
    var user = req.flash('user')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('users/new', { user: user, errors: errors });
});

// create
router.post('/', function (req, res) {
    User.create(req.body, function (err, user) {
        if (err) {
            req.flash('user', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/users/new');
        }
        res.redirect('/users');
    });
});

// show
router.get('/:username', util.isLoggedin, checkPermission, function (req, res) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) { return res.json(err); }
        res.render('users/show', { user: user });
    });
});

// edit
router.get('/:username/edit', util.isLoggedin, checkPermission, function (req, res) {
    var user = req.flash('user')[0]; // 처음 들어오는 경우 분기 처리가 필요하므로 {}로 빈 객체를 넣지 않는다.
    var errors = req.flash('errors')[0] || {};
    if (!user) { // user가 없으면 처음 들어온 경우이므로, 기존의 값을 form에 넣는다.
        User.findOne({ username: req.params.username }, function (err, user) {
            if (err) { return res.json(err); }
            res.render('users/edit', { username: req.params.username, user: user, errors: errors });
        });
    } else { // user가 있으면 오류가 있어 update에서 돌아온 경우이다.
        res.render('users/edit', { username: req.params.username, user: user, errors: errors });
    }
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function (req, res, next) {
    User.findOne({ username: req.params.username })
        .select('password')
        .exec(function (err, user) {
            if (err) { return res.json(err); }

            // update user object
            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            for (var p in req.body) {
                user[p] = req.body[p];
            }

            // save updated user
            user.save(function (err, user) {
                if (err) {
                    req.flash('user', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/users/' + req.params.username + '/edit');
                }
                res.redirect('/users/' + user.username);
            });
        });
});

delete
// Todo... 관리자 전용으로 바꿀 것.
router.delete('/:username', util.isLoggedin, function (req, res) {
    User.deleteOne({ username: req.params.username }, function (err) {
        if (err) { return res.json(err); }
        res.redirect('/users');
    });
});

module.exports = router;

function checkPermission(req, res, next) {
    User.findOne({ username:req.params.username }, function(err, user) {
        if(err) { return res.json(err); }
        if(user.id != req.user.id) { return util.noPermission(req, res); } // 유저 본인이 아니면 noPermission 함수 호출.
        next();
    });
}