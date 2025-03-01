
import { hash, compare } from "bcrypt";
import {validateUser, validateUserNameExist } from "./validation.js"

import { database } from './db-config.js';


// Create user after it passes all the validation processes
export const createUser = async (username, password) => {
  const validationError = validateUser(username, password);
  if (validationError) return { errorMessage: validationError };

  const userExistsError = validateUserNameExist(username);
  if (userExistsError) return { errorMessage: userExistsError };

  try {
    const hashedPassword = await hash(password, 12);
    const newUser = { username, hashedPassword };
    const storedUser = database.create(newUser);
    return { user: storedUser };
  } catch (error) {
    return { errorMessage: `Internal server error: ${error.message}` };
  }
};

// If a user exist in db then check for the password.
export const checkCredential = async (user, password) => {
  const cleanPassword = password.trim();
  try {
    const isPasswordCorrect = await compare(cleanPassword, user.hashedPassword);

    if (!isPasswordCorrect) return { isPasswordCorrect: false };
    else return { isPasswordCorrect: true };
  } catch (error) {
    return { errorMessage: `Internal server error: ${error.message}` };
  }
};

// Get user by id
export const getUserById = (id) => database.getById(id);


export default database;