var express = require('express');
var app = express();

app.use(express.customer('/customer/homepage.html'));
app.listen(8080, () => console.log('listening on port 8080'));