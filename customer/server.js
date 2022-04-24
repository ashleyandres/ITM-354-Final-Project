var express = require('express');
var app = express();

app.use(express.customer('/customer'));
app.listen(8080, () => console.log('listening on port 8080'));