var util = {};

util.parseError = function (errors) {
    var parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = { message: validationError.message };
        }
    }
    else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message: 'This username already exists!' };
    }
    else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

util.isLoggedin = function(req, res, next) { // callback으로 사용
    if(req.isAuthenticated()) { // login 되어 있을 경우
        next(); // callback 호출
    } else {
        req.flash('error', {login: 'Please login first!'});
        res.redirect('/login');
    }
}

util.noPermission = function(req, res) {
    req.flash('errors', {login:"No Permission."}); // 권한이 없는 경우엔
    req.logout(); // 로그아웃 시키고
    res.redirect('/login'); // 로그인 페이지로
}

module.exports = util;