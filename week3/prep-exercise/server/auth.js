import jsonwebtoken from "jsonwebtoken";


export const generateAccessToken = (validatedUser) => {
  const SECRET = process.env.JWT_SECRET;
  const payload = { id: validatedUser.id, username: validatedUser.username };
  const token = jsonwebtoken.sign(payload, SECRET, { expiresIn: "1800s" });
  return token;
};

// User authentication middleware 
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Token is required." });
  }

  const token = authHeader.split(" ")[1];
  const SECRET = process.env.JWT_SECRET;

  try {
    const decodedUser = jsonwebtoken.verify(token, SECRET);
    req.user = decodedUser;
    return next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }

  return res.status(401).send({ message: "Unauthorized request." });
};


