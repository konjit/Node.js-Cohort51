const express = require("express");
const app = express();
const path = require("path");

const fs = require("fs");

const blogsDir = path.join(__dirname, "blogs");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Submit a blog
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  const filePath = path.join(blogsDir, title);

  fs.writeFileSync(filePath, content);
  res.status(201).send({ message: "Ok" });
});

// Update a blog
app.put("/posts/:title", (req, res) => {
  const { content } = req.body;
  const title = req.params.title;

  if (!title || !content) {
    return res.status(400).send({ message: "Content is required." });
  }

  const filePath = path.join(blogsDir, title);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: `Post ${title} not found.` });
  }

  fs.writeFileSync(filePath, content);
  res.status(200).send({ message: "Ok" });
});

// Delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;
  console.log(title);
  const filePath = path.join(blogsDir, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: `Post ${title} not found.` });
  }

  fs.unlinkSync(filePath);
  res.status(200).send({ message: "Ok" });
});

// Read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filePath = path.join(blogsDir, title);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("This post does not exist.");
  }

  const post = fs.readFileSync(filePath, "utf-8");
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(post);
});

// BONUS: Get all blogs
app.get("/blogs/", (req, res) => {
  const blogs = fs.readdirSync(blogsDir);
  if(!blogs){
    res.status(500).send({ message: " The resource posts does not exist." });
  }
  const blogTitles = blogs.map((blog) => ({ title: blog }));
  res.status(200).send(blogTitles);

  
});

app.listen(3000);
