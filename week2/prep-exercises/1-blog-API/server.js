import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const blogsDir = path.resolve("blogs");
const PORT = 3000;

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Submit a blog
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send({ message: "Title and content are required." });
  }
  const filePath = path.join(blogsDir, title);
  const submitBlog = () =>
    handleFileOperation(() => fs.writeFileSync(filePath, content));

  const result = submitBlog();
  console.log(result);
  if (!result) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
  res.status(200).send({ message: "Blog is submitted successfully." });
});

// Update a blog
app.put("/blogs/:title", (req, res) => {
  const { content } = req.body;
  const title = req.params.title;

  if (!title || !content) {
    return res.status(400).send({ message: "Content is required." });
  }

  const filePath = path.join(blogsDir, title);
  if (!doesAFileExists(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }

  const updateBlog = () =>
    handleFileOperation(() => fs.writeFileSync(filePath, content));

  const result = updateBlog();
  if (!result) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }
  res.status(201).send({ message: "Blog is updated successfully" });
});

// Delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;

  const filePath = path.join(blogsDir, title);
  if (!doesAFileExists(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }
  const deleteBlog = () => handleFileOperation(() => fs.unlinkSync(filePath));

  const result = deleteBlog();
  if (!result) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }

  res.status(200).send({ message: "Blog is deleted successfully." });
});

// Read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;

  const filePath = path.join(blogsDir, title);
  if (!doesAFileExists(filePath)) {
    return res.status(404).send({ message: "Blog is not found." });
  }

  let blog = null;
  const readBlog = () => handleFileOperation(() => blog = fs.readFileSync(filePath, "utf-8"));

  const result = readBlog();
  if (!result) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(blog);
});

// BONUS: Get all blogs
app.get("/blogs/", (req, res) => {
  const blogs = [];
  const getBlogs = () => handleFileOperation(() =>{ 
   blogs.push(...fs.readdirSync(blogsDir))
  });

  const result = getBlogs();
  if (!result) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again." });
  }

  const blogTitles = blogs.map((blog) => ({ title: blog }));
  res.status(200).send(blogTitles);
});

/** Checks if a specified file exists or not. */
const doesAFileExists = (filePath) => fs.existsSync(filePath);

/** A helper function that checks if a file operation is a success or failure. */
const handleFileOperation = (fileOperation) => {
  try {
    fileOperation();
    return true;
  } catch (err) {
    console.log("Error occurred during file operation.");
    return false;
  }
};

app.listen(PORT);
