//require modules
const express = require("express");
const authController = require("./controllers/authController");

//start app
const app = express();

//template engine
app.set("view engine", "ejs");

//set up static files
app.use(express.static("./public"));

//set-up encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//fire main controller
authController(app);

//listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));