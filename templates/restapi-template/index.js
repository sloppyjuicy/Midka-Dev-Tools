const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json);

//Routes
/* 
  @route /api
  @description This is an example route
*/
app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}!`);
});
