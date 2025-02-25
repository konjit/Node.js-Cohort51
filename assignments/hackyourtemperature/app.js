import express from "express";
import { API_KEY, WRONG_API_KEY } from "./sources/keys.js";
import fetch from "node-fetch";
import * as helper from "./helper.js";

const PORT = 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello from backend to frontend!");
});

app.post("/weather", async (req, res) => {
  const cityName = req.body.cityName;
  if (!cityName) {
    return res.status(400).send({ message: "City name is required." });
  }

  let url = null;
  if (req.body.wrongUrl) {
    url = req.body.wrongUrl;
  } else {
    url = helper.getWeatherUrl(cityName);
  }

  try {
    const data = await fetchData(url);

    if (data.cod === 200) {
      return res.status(200).send({
        weatherText: `The temperature in ${data.name} is ${data.main.temp}°`,
      });

    } 
    
    if(data.cod === "404" && data.message === "city not found"){
      return res.status(404).send({weatherText: "City is not found!"})
    }

    if(data.cod === 401 && data.message.includes("API")){
      return res.status(401).send({message: "Unauthorized access."})
    }

    if(data.cod === "404" && data.message === "Internal error"){
      return res.status(404).send({message: "Resource not found."})
    }
  
    if(data.cod >= 400 && data.cod < 600){
      return res.status(data.cod).send({message: data.message})
    }

    return res.status(500).send({message: "Unexpected error occurred."})

  } catch (error) {
    if (error.message.includes("ENOTFOUND") || error.message.includes("ERR_NAME_NOT_RESOLVED")) {
      return res.status(400).send({ message: "Invalid domain name." });
    }
    return res.status(500).send({ message: "Unable to fetch data." });
  }
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    throw new Error(error);
  }
};

export default app;
