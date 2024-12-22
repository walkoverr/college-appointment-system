const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log(req.header("authorization"))
  const token = req.header("authorization")?.split(" ")[1];
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
