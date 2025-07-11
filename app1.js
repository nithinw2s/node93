const http = require("http");

const server = http.createServer((req, res) => {
  let body = "";

  // Listen for 'data' event to collect chunks of data
  req.on("data", (chunk) => {
    body += chunk;
  });

  // Listen for 'end' event to process the complete data
  req.on("end", () => {
    console.log("Received data:", body);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Data received successfully!");
  });

  // Handle errors
  req.on("error", (err) => {
    console.error("Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("An error occurred!");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
