const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory collection for this practical. Data resets when the server restarts.
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", year: 1999 }
];
let nextId = 3;

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Book Collection API",
    endpoints: {
      list: "GET /api/books",
      getOne: "GET /api/books/:id",
      create: "POST /api/books",
      update: "PUT /api/books/:id",
      delete: "DELETE /api/books/:id"
    }
  });
});

// READ: Get every book
app.get("/api/books", (req, res) => {
  res.status(200).json({ count: books.length, books });
});

// READ: Get one book by ID
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Book ID must be a positive integer." });
  }
  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  res.status(200).json(book);
});

// CREATE: Add a book
app.post("/api/books", (req, res) => {
  const { title, author, year } = req.body;

  if (typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim()) {
    return res.status(400).json({
      error: "Title and author are required and must be non-empty strings."
    });
  }

  if (year !== undefined &&
      (!Number.isInteger(year) || year < 0 || year > new Date().getFullYear())) {
    return res.status(400).json({ error: "Year must be a valid integer year." });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    year: year === undefined ? null : year
  };

  books.push(newBook);
  res.status(201).json({ message: "Book created successfully.", book: newBook });
});

// UPDATE: Replace editable book fields
app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Book ID must be a positive integer." });
  }
  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  const { title, author, year } = req.body;

  if (typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim()) {
    return res.status(400).json({
      error: "Title and author are required and must be non-empty strings."
    });
  }

  if (year !== undefined && year !== null &&
      (!Number.isInteger(year) || year < 0 || year > new Date().getFullYear())) {
    return res.status(400).json({ error: "Year must be a valid integer year." });
  }

  book.title = title.trim();
  book.author = author.trim();
  book.year = year === undefined ? null : year;

  res.status(200).json({ message: "Book updated successfully.", book });
});

// DELETE: Remove a book
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Book ID must be a positive integer." });
  }

  const index = books.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.status(200).json({ message: "Book deleted successfully.", book: deletedBook });
});

// Handle malformed JSON bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Request body contains invalid JSON." });
  }
  next(err);
});

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Book API server is running at http://localhost:${PORT}`);
});
