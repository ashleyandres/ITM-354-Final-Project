// Vincent Wang - 4/22/21

// Code from Assignment1 Instructions and from Prof. Port's Getting started with Assignment 2 screencast
// creates our own server to host our website on
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/products.js.js');
var products = data.products
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs'); // Starts up qs system actions
var fs = require('fs'); // Starts up fs system actions
const querystring = require('querystring');
const { response } = require('express');
var cookieParser = require('cookie-parser'); // Sets cookie-parser
var session = require('express-session'); // Sets express-session module 
const nodemailer = require("nodemailer"); // Sets node mailer module 
app.use(cookieParser()); // Use cookie-parser

app.use(session({secret: "ITM352 rocks!"})); // Taken from Lab 15

// Reads user_data.json - Lab 14 code
var user_data_file = "./user_data.json";
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file)
    var user_data = JSON.parse(fs.readFileSync(user_data_file, "utf-8"));
} 

// detects request for all and displays path - code taken from Lab 13 Ex 4
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

// Generates invoice based off the one in our cart.html and emails it to the users email. 
// Nodemailer Code referenced from Daniel Port's Assingment 3 example code
app.post("/checkout", function (request, response) {

        // Generate HTML invoice string
        var user_email = user_data[request.cookies.username].email; // sets email from user_data file to user_email
        var name = user_data[request.cookies.username].fullname // sets fullname from user_data file to name
        cart = JSON.parse(request.query['cartData']); // parses for cartData and puts in cart

        // following invoice taken from cart.html
      invoice_str = `
      <link rel="stylesheet" href="invoice.css">
      <body>
      <table border="2">
          <tbody>
            <tr>
              <th style="text-align: center;" width="43%">Item</th>
              <th style="text-align: center;" width="11%">Quantity</th>
              <th style="text-align: center;" width="13%">Price</th>
              <th style="text-align: center;" width="54%">Extended Price</th>
            </tr>`;
            
      
            // Code taken from Invoice4 and modified while referring to example code from Assignment1 Instructions
            // Displays Purchased items
            subtotal = 0;
            for (product in products) {
                for (i = 0; i < products[product].length; i++) {
                  quantity = cart[`${product}${i}`]
                  if (quantity > 0) {
                    extended_price = quantity * products[product][i].price
                    subtotal += extended_price;
            
            invoice_str +=
             `
            <tr>
              <td width="43%">${products[product][i].name}</td>
              <td align="center" width="11%">${quantity}</td>
              <td width="13%">\$${products[product][i].price}</td>
              <td width="54%">\$${extended_price}</td>
            </tr>`;
      
            
      }
      }
      }
      
      // All code below taken from Invoice4 and altered
      // Compute Sales Tax
      var tax = 0.0575;
      var tax_amount = subtotal * tax;
      // Compute Shipping Fee depending on Subtotal amount
      var shipping_fee;
      var small_fee = 2;
      var medium_fee = 5;
      var large_fee = 0.05;
      if (subtotal < 50) {
        shipping_fee = small_fee;
      }
      else if (subtotal >= 50 && subtotal < 100) {
        shipping_fee = medium_fee;
      }
      else if (subtotal >= 100) {
        shipping_fee = subtotal * large_fee;
      }
      
      // Compute the Grand Total
      var grand_total = subtotal + tax_amount + shipping_fee;

      invoice_str += `
            <tr>
              <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
              <td width="54%">\$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="3" width="67%">Tax @ 5.75%</span></td>
              <td width="54%">\$${tax_amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="3" width="67%">Shipping</span></td>
              <td width="54%">\$${shipping_fee.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
              <td width="54%"><strong>\$${grand_total.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="3" width="67%"><strong>OUR SHIPPING POLICY IS:A subtotal $0 - $49.99 will be $2 shipping A subtotal $50 - $99.99 will be $5 shipping Subtotals over $100 will be charged 5% of the subtotal amount</strong></td>
              <td style="text-align: center;" width="54%"><H1>Thank You For Your Purchase ${name}! This Invoice Has Been E-Mailed To You At ${user_email}!</H1></td>
            </tr>
            <tr>
            <td style="text-align: center;" colspan="3" width="67%"><input type="button" value="Back to Store!" onclick="history.back()"></td>
          </tr>
          </tbody>
        </table>      
      </body>`
    
      // Set up mail server. Only will work on UH Network due to security restrictions
      var transporter = nodemailer.createTransport({
        host: 'mail.hawaii.edu',
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
      var mailOptions = {
        from: 'vincentwang12345@gmail.com',
        to: user_email,
        subject: 'Hydration Station Invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {

        }
        response.send(invoice_str);
      });
     
    });

// Since we are now using cookies and sessions I have decided to comment out the following code as it is no longer needed
// The following redirects to the invoice with a query string if no errors however we are no longer using query strings
// We also are no longer redirecting to different pages - navigation is now through the nav bars

//app.post("/process_page", function (request, response, next) {
    // following code same as code in products_display but modified
//    let POST = request.body;
//    if (typeof POST['purchase_submit'] != 'undefined') {
//    const stringified = querystring.stringify(POST);
//    has_errors = false; // assume quantities are valid
//    total_qty = 0; 
//    for (i in products) {
//        if (typeof POST[`quantity${i}`] != "undefined") {
//            a_qty = POST[`quantity${i}`];
            // Sticky textboxes
//            total_qty += a_qty; 
//            if(!isNonNegInt(a_qty)) {
//                has_errors = true; //invalid quantity error
//            }
//        }
//    }
    // Respond to errors or redirect to login if no errors - response.redirect code found from Getting start with Assign. 2 screencast
//    if(has_errors) { // if has errors then keeps user on products_display page
        //response.redirect("./index.html?" + stringified);
//    } else if(total_qty == 0) { // if no quantity selection then keeps user on products_display page
        //response.redirect("./index.html?" + stringified);
//    } else { // if nothing wrong then send user to login page

//    }
//}
//})

// Processes login form - Modified Code from Prof Port's Assignment 2 screencast
app.post('/process_login', function (request, response, next) {
    request.query["uname"] = request.body["uname"];
    // Sets user input for username as uname; put into lower case to make it case insensitive
    let username_entered = request.body["uname"].toLowerCase();
    let password_entered = request.body["psw"];
    // checks if username_entered matches any usernames in user_data
    if (typeof user_data[username_entered] != "undefined") {
        // Checks if password matches the password that is connected to that username
        if (user_data[username_entered]["password"] == password_entered) {
            // sends user back to home but now they have a cookie we can use to check if they have logged in
        response.cookie("username", request.body["uname"], path="/") // Gives a global username coookie
        response.redirect("index.html")
    } else {

    }
} else {

}
// sends back to login if login info does not match user_data info
response.redirect("login.html");
})


// Processes register form - Modified Code from Prof Port's Assignment 2 screencast
app.post('/process_register', function (request, response, next) {
    request.query["uname"] = request.body["uname"];  
    request.query["fullname"] = request.body["fullname"]; 
    request.query["email"] = request.body["email"]; 
    request.query["psw"] = request.body["psw"]; 
    request.query["pswRepeat"] = request.body["pswRepeat"];
    
    // USERNAME VALIDATION:
    // Checks to make sure there are no special char in uname - 
    // Code from https://www.dofactory.com/javascript/regular-expressions
    var unameRegex = /^[A-Za-z0-9]+$/
    // emailRegex checks to make sure that it is valid email
    var emailRegex = /[0-9a-zA-Z]+@[0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+/g;
    if (unameRegex.test(request.body.uname)) {

    } else {
        response.redirect("register.html");
    }
    // Sets uname to min of 4 char and max of 10 char
    if ((request.body.uname.length < 4) || (request.body.uname.length > 10)) {
        response.redirect("register.html");
    }

    // Sets fullname to max of 30 char
    if (request.body.fullname.length > 30) {
        response.redirect("register.html");
    }

    // PASSWORD VALIDATION:
    // Sets psw to min of 6 char
    if (request.body.psw.length < 6) {
        response.redirect("register.html");
    }
    // Makes sure that both psw and pswRepeat are the same
    if (request.body.psw != request.body.pswRepeat){
        response.redirect("register.html");
    }

    // EMAIL VALIDATION:
    // Checks whether email is in the proper format of an email address
    if (emailRegex.test(request.body.email)) {

    } else {
        response.redirect("register.html");
    }

    

    // add a new user to the DB
    // Adds uname to user_data in lowercase to make uname case insensitive
    username = request.body["uname"].toLowerCase(); 
    user_data[username] = {};
    user_data[username].fullname = request.body["fullname"];
    user_data[username].password = request.body["psw"];
    user_data[username].email = request.body["email"];
    // save updated user_data to file (DB)
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    // Give global cookies for username, fullname, and email
    response.cookie("username", request.body["uname"].toLowerCase(), path="/");
    response.cookie("fullname", request.body["fullname"], path="/");
    response.cookie("email", request.body["email"], path="/");
    response.redirect("index.html"); 
});

app.use(express.static('./public')); // Runs our public folder on the server
app.listen(8080, () => console.log('listening on wang 8080')); // Runs server on 8080

