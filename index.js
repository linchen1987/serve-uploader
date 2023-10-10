const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const cwd = process.cwd();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uploadFolder = path.join(cwd, "uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Decode the filename
    let originalFilename = decodeURIComponent(
      req.headers["x-encoded-filename"]
    );
    cb(null, originalFilename);
  },
});

const upload = multer({ storage: storage });

// Serve HTML form at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle file upload
app.post("/upload", upload.single("sampleFile"), (req, res) => {
  if (!req.file) {
    return res.send("Please upload a file");
  }

  let fileName = decodeURIComponent(req.body.encodedFilename);
  fs.renameSync(req.file.path, path.join("uploads", fileName));
  res.send("File uploaded!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
