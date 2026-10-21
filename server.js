const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4173);
const PUBLIC_DIR = path.join(__dirname, "public");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(PUBLIC_DIR, requested);
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(file, (error, body) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500);
      return res.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(body);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log(`XHS Travel Studio: http://127.0.0.1:${PORT}`);
});
