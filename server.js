var express = require('express');
var app = express();

app.use(express.static('./static'));
app.listen(8081, () => console.log(`listening on port 8080`));