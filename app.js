const express = require("express");
const app = express();

// Routes
const userRoute = require("./routes/user");

app.use("/users", userRoute);

app.get("/", (req, res) => {
  let output = "<h1>File Sharing Website</h1>";
  output += "<p>More info will be available soon.</p>";
  res.send(output);
});


app.listen(3000);