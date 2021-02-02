// Package Definition
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://admin:lshlow1004@cluster0.2wzx7.mongodb.net/nodejs?retryWrites=true&w=majority');
var db = mongoose.connection;
db.once('open', function () {
    console.log('DB connected');
});
db.on('error', function (err) {
    console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));

// Passport // Other settings 보다 밑에 둬야 함
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares(for Passport)// 로그인에 관련되었으므로 route 무시하도록 Routes보다 무조건 위에 올려 놓을 것.
app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

// Port setting
var port = 3000;
app.listen(port, function () {
    console.log('server on! http://localhost:' + port);
});