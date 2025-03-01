// I tired to use it like Singleton design pattern 

import newDatabase from "./database.js";

const isPersistent = true;
export const database = newDatabase({ isPersistent });
