const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require("morgan");
const path = require("path");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const { sequelize } = require('./models');
const signupRouter = require('./routes/signup');
const loginRouter = require("./routes/login");
const postRouter = require('./routes/post');
const commentRouter = require("./routes/comment");

const app = express();
dotenv.config();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('DB 연결 되었습니다.')
  })
  .catch((err) => {
    console.log(err)
  })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
// app.use('/users',)


app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중')
});
