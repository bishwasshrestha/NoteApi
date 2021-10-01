import 'dotenv/config.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Users = [];


app.post('/signup', (req, res) => {
  const body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send('Invalid details');
  } else if (Users.filter((user) => user.email === body.email).length > 0) {
    res.status('409').send({
      message: 'User Already Exists! Login or choose another user email',
    });
  } else {
    const newUser = { email: req.body.email, password: req.body.password };

    Users.push(newUser);

    res.json(Users);
  }
});

app.post('/signin', (req, res) => {
  const body = req.body;

  if (!body.email || !body.password) {
    res.status(403).send({ message: 'Please enter both email and password' });
  }
  const [currentUser] = Users.filter(
    (user) => user.email === body.email && user.password === body.password
  );
  if (!currentUser) res.status(404).send({ message: 'No user exists' });
  else {
    const token = jwt.sign(currentUser, process.env.SECRET_KEY, {
      expiresIn: 60 * 15,
    });

    res.cookie('auth', token, { maxAge: 900000 });

    res.send({ message: 'Successfully signed in' });
  }
});

const checkSignIn = (req, res, next) => {
  const token = req.cookies.auth;
  console.log('token', token);

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
      err && res.status(403).send('Error');
      console.log('Data.-', data);
      next();
    });
  }
};

app.get('/', checkSignIn,(req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
