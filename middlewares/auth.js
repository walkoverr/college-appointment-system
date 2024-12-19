const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) 
    {
      return res.status(401).json({ message: "Access denied, token missing" });
    }

  try 
  {
    const decoded = jwt.verify(token, process.env.SECRET_KEY,{expiresIn:"1h"});
    req.user = decoded;
    next();
  } 
  catch (error) 
  {
    res.status(400).json({ message: "Invalid token" });
  }
};
