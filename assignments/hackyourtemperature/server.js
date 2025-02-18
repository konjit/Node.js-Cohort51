import express from "express";

const PORT = 3000;

const app = express();
app.use(express.json())


app.get('/', (req, res)=>{
  res.status(200).send("hello from backend to frontend!");
})

app.post('/weather', (req, res) => {
  const cityName = req.body.cityName;
  if(!cityName) {
    return res.status(404).json({message: "City name is required."})
  }
  res.status(200).json({cityName: cityName});
})

app.listen(PORT);
