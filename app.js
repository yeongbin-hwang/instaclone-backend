const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // https가 아니면 client가 server로 쿠키를 보내지 않음.
    },
  })
);

app.use(cors());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} no router`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({ success: false, err });
});

app.listen(app.get('port'), () => {
  console.log('listening on', app.get('port'));
});
