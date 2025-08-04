const express = require("express");
const apiRoutes = require("./routes/api");

const app = express();

    // Middleware to parse JSON requests
    app.use(express.json());

    // Use API routes
app.use("/api", apiRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});