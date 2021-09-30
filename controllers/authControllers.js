'use strict';
import jwt from 'jsonwebtoken';
import passport from '../utils/pass.js';
import { saveToDB } from '../utils/userModel.js';

const authenticate = (req, res) => {
  // Authentication handled as a Promise
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log('local', err, user, info);
      try {
        if (err || !user) {
          reject(err);
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            reject(err);
          }
          //   // generate a signed Json web token with the contents of user object and return it in the response
          const token = jwt.sign(user, process.env.SECRET_KEY);
          resolve({ user, token });
        });
      } catch (err) {
        reject(err.message);
      }
    })(req, res);
  });
};

const userLogin = async (req, res) => {
  try {
    const response = await authenticate(req, res);
    console.log('response from authenticate', response);
    return res.send({
      id: response.user.id,
      ...response.user,
      token: response.token,
    });
  } catch (err) {
    res.send({ error: err });
    //throw new Error(err);
  }
};

const userRegister = async (req, res, next) => {
  const body = req.body;

  if (!body.email || !body.password) {
    return res.status(400).json({ error: 'Credential missing' });
  }

  if (await saveToDB(body)) {
    // This will call next middleware on the list
    next();
  } else {
    return res.status(400).json({ error: 'register error' });
  }
};

const userLogout = async (req, res) => {
  // Invoking logout() will remove the req.user property and clear the login session (if any).
  req.logout();
  res.json({ message: 'logout' });
};

const checkAuth = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, user) => {
      if (err || !user) {
        reject('Not authenticated or user expired');
      }
      resolve(user);
      next();
    })(req, res);
  });
};

export { userLogin, userRegister, userLogout, checkAuth };
