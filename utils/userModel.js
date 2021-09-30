import fs from 'fs';

const generateId = (users) => {
  const maxId = users.length > 0 ? Math.max(...users.map((n) => n.id)) : 0;
  return maxId + 1;
};

const saveToDB = (user) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile('./db.json', 'utf8', (err, data) => {
        const fileData = JSON.parse(data);
        const id = generateId(fileData);

        fileData.push({ ...user, id: id, dateCreated: new Date() });

        fs.writeFile('./db.json', JSON.stringify(fileData, null, 2), (err) => {
          err && new Error(err);
        });
        resolve(fileData);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getUserFromDB = async (email) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile('./db.json', 'utf8', (err, data) => {
        const fileData = JSON.parse(data);
        const user = fileData.filter((user) => user.email === email);
        resolve(user);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile('./db.json', 'utf8', (err, data) => {
        const fileData = JSON.parse(data);
        resolve(fileData);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export { saveToDB, getUserFromDB, getUsers };
