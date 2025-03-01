import express from "express";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

import dotenv from "dotenv";
import { createUser, checkCredential, getUserById } from "./users.js";
import { generateAccessToken, authenticateUser } from "./auth.js";
import { preValidateLogin } from "./validation.js";

let app = express();
dotenv.config();
app.use(express.json());

// Submit request
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const { errorMessage, user } = await createUser(username, password);

  if (errorMessage) {
    return res.status(400).send({ message: errorMessage });
  }

  res.status(200).send({ id: user.id, username: user.username });
});

// Login request
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const { isValidInput, doesUserExists, validatedUser } = preValidateLogin(
    username,
    password
  );

  if (!isValidInput) {
    return res
      .status(400)
      .send({ message: "Username and password are required." });
  }

  if (!doesUserExists) {
    return res.status(400).send({ message: "User not found." });
  }

  const { isPasswordCorrect } = await checkCredential(validatedUser, password);

  if (!isPasswordCorrect) {
    return res.status(404).send({ message: "Invalid username or password." });
  }

  const token = generateAccessToken(validatedUser);

  res.status(201).send({ token: token });
});

// Profile request
app.get("/auth/profile", authenticateUser, (req, res) => {
  const userId  = req.user.id;
  console.log(userId)
  const user = getUserById(userId);

  if (!user) {
    return res.status(401).send({ message: "User not found." });
  }

  res.status(200).send({ username: user.username });
});

// Logout request
app.post("/auth/logout", (req, res) => {
  res.send(204).send("Logged out successfully.");
});

// Serve the front-end application from the `client` folder
app.use(express.static("client"));

export default app;
