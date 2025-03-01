
import { database } from './db-config.js';

// For validating username and password.
export const validateUser = (username, password) => {
  const usernameError = validateUsername(username);
  if (usernameError) return usernameError;

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return null;
};

// Checks if username is not empty string or < 4 in length;
const validateUsername = (username) => {
  const cleanUsername = username.trim();
  if (cleanUsername === "") return "Username is required!";
  if (cleanUsername.length < 4)
    return "Username should be at least 4 characters long.";
  return null;
};

// Checks if password is not empty string or < 8 in length;
const validatePassword = (password) => {
  const cleanPassword = password.trim();
  if (cleanPassword === "") return "Password is required.";
  if (cleanPassword.length < 8)
    return "Password should be at least 8 characters long.";
  return null;
};

/**
 * Checks if the username is already in use. For security reasons, 
 * the system does not explicitly confirm if the username exists.
 * */
export const validateUserNameExist = (username) => {
  const users = database.getAllUsers();
  const userExists = users.find((user) => user.username === username);
  return userExists
    ? "Failed to register, please choose another username."
    : null;
};

/**
 *  This is specifically for login validation but can be refactored 
 *  since it uses same logic like the above functions */ 
export const preValidateLogin = (username, password) => {
  const users = database.getAllUsers();

  const cleanedUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanedUsername || !cleanPassword) return { isValidInput: false };
  const isValidInput = true;

  const validatedUser = users.find((user) => cleanedUsername === user.username);
  if (!validatedUser || users.length === 0)
    return { isValidInput, doesUserExists: false };

  return {
    isValidInput: true,
    doesUserExists: true,
    validatedUser: validatedUser,
  };
};