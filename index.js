import 'dotenv/config.js';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Users = [];

const generateId = (list) => {
  const maxId = list.length > 0 ? Math.max(...list.map((n) => n.user_id)) : 0;
  return maxId + 1;
};

app.post('/signup', (req, res) => {
  const body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send('Invalid details');
  } else if (Users.filter((user) => user.email === body.email).length > 0) {
    res.status('409').send({
      message: 'User Already Exists! Login or choose another user email',
    });
  } else {
    const userId = generateId(Users);
    const newUser = {
      user_id: userId,
      email: body.email,
      password: body.password,
      time_Created: new Date(),
    };

    Users.push(newUser);

    res.status(201).send({
      message: 'User created successfully',
      user_id: userId,
    });
  }
});

app.post('/signin', (req, res) => {
  const body = req.body;

  if (!body.email || !body.password) {
    res.status(403).send({ Error: 'Please enter both email and password' });
  }
  const [currentUser] = Users.filter(
    (user) => user.email === body.email && user.password === body.password
  );

  if (!currentUser) {
    res.status(404).send({ Error: 'No user exists' });
  } else {
    const token = jwt.sign(currentUser, process.env.SECRET_KEY, {
      expiresIn: 60 * 15,
    });
    delete currentUser.password;

    const successResponse = {
      message: 'Logged in successfully',
      token: token,
      user: currentUser,
    };
    res.status(200).send(successResponse);
  }
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const [type, bearerToken] = bearerHeader.split(' ');

    bearerToken &&
      jwt.verify(bearerToken, process.env.SECRET_KEY, (err, data) => {
        err && res.status(403).send({ Error: err.message });
        console.log('Data.-', data);
        next();
      });
  } else {
    res.status(403).send({ message: 'Not authorized' });
  }
};

app.get('/', verifyToken, (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
