import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const blogsDir = path.resolve("blogs");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Submit a blog
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send({ message: "Content is required." });
  }
  const filePath = path.join(blogsDir, title);
  const submitBlog = () => {
    fs.writeFileSync(filePath, content);
    res.status(200).send({ message: "Blog is created successfully." });
  };

  handleFileOperation(submitBlog, res, filePath, content);
});

// Update a blog
app.put("/posts/:title", (req, res) => {
  const { content } = req.body;
  const title = req.params.title;

  if (!title || !content) {
    return res.status(400).send({ message: "Content is required." });
  }

  const filePath = path.join(blogsDir, title);
  checkFileExists(filePath, res);

  const updateBlog = () => {
    fs.writeFileSync(filePath, content);
    res.status(201).send({ message: "Blog is updated successfully" });
  };

  handleFileOperation(updateBlog, res, filePath, content);
});

// Delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;

  const filePath = path.join(blogsDir, title);

  checkFileExists(filePath, res);

  const deleteBlog = () => {
    fs.unlinkSync(filePath);
    res.status(200).send({ message: "Blog is deleted successfully." });
  };
  handleFileOperation(deleteBlog, res, filePath);
});

// Read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const filePath = path.join(blogsDir, title);

  checkFileExists(filePath, res);

  const encoding = "utf-8";
  const readBlog = () => {
    const post = fs.readFileSync(filePath, encoding);
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(post);
  };

  handleFileOperation(readBlog, res, filePath, encoding);
});

// BONUS: Get all blogs
app.get("/blogs/", (req, res) => {
  const blogs = fs.readdirSync(blogsDir);
  const getBlogs = () => {
    if (!blogs) {
      res.status(500).send({ message: "No blog is found." });
    }
    const blogTitles = blogs.map((blog) => ({ title: blog }));
    res.status(200).send(blogTitles);
  };

  handleFileOperation(getBlogs, res, blogs);
});

/** A helper function that checks if a file operation is a success or failure. */

const handleFileOperation = (operation, ...args) => {
  try {
    return operation(...args);
  } catch (err) {
    res.status(500).send({ message: `Error occurred while ${msg}` });
  }
};

/*Checks if a specified file exists or not. */
const checkFileExists = (filePath, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("This blog does not exist.");
  }
};

app.listen(3000);
