const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json("Token Not Present");
        return;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'secretkey');
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
        res.status(401).json("Invalid Token");
        return;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};