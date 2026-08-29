const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const buildPath = path.join(__dirname, "build");

const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    let requestPath = req.url.split("?")[0];

    if (requestPath === "/home" || requestPath === "/home.html") {
        requestPath = "/home.html";
    } else if (
        requestPath === "/" ||
        requestPath.startsWith("/app") ||
        requestPath.startsWith("/gift")
    ) {
        requestPath = "/index.html";
    }

    const filePath = path.join(buildPath, requestPath);

    if (!filePath.startsWith(buildPath)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            "Content-Type": mimeTypes[extension] || "application/octet-stream"
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});