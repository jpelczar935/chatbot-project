const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Temporary "database" in memory (later we'll use MongoDB)
const users = [];

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // save user
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered!" });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({ message: `Welcome back, ${username}!` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
