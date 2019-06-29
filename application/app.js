const express = require("express");
const app = express();

const path = __dirname + '/public';
const port = 3000;

// Serve files statically
app.use(express.static(path));

// Display 404 page when attempting to view undefined page
app.use("*",function(req,res) {
    res.sendFile(path + "/404.html");
});

app.listen(port, function() {
    console.log(`Server running on Port: ${port}`);
});
