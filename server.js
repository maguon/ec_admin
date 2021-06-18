const express = require('express')
const app = express()
app.use(express.static(__dirname + '/build'));
app.listen(9910);
console.log("ec admin web start at 9910");