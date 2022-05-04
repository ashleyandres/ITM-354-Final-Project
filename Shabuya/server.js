var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');

console.log("Connecting to localhost..."); 
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: 3306,
  database: "Shabuya",
  password: ""
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

function query_DB_sales_report(POST_sale_report, response) { // function for process_sales_report_query
      beg_date = POST_sale_report['beg_date'];      // Grab the parameters from the submitted form
      end_date = POST_sale_report['end_date'];
      query = "SELECT Customer_activity_date, Order_number, Quantity_ordered FROM Orders where From_date > " + beg_date + " AND To_date < " + end_date;  // Build the query string
      con.query(query, function (err, result, fields) {   // Run the query
        if (err) throw err;
        console.log(result);
        var res_string = JSON.stringify(result);
        var res_json = JSON.parse(res_string);
        console.log(res_json);
  
        // Now build the response: table of results and form to do another query
        response_form = `<form action="managerinput.html" method="GET">`;
        response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
        response_form += `<td><B>Date of Sales</td><td><B>Total Sales</td><td><B>Date</td>`;
        for (i in res_json) {
          response_form += `<tr><td> ${res_json[i].Order_number}</td>`;
          response_form += `<td> ${res_json[i].Quantity_ordered}</td>`;
          response_form += `<td> ${res_json[i].Customer_activity_date}</td>`;
        }
        response_form += "</table>";
        response_form += `<input type="submit" value="Generate Another Report"> </form>`;
        response.send(response_form);
      });
    }

    function query_DB_customer_report(POST_customer_report, response) { // function for process_customer_report_query
        c_fname = POST_customer_report['c_fname'];      // Grab the parameters from the submitted form
        c_lname = POST_customer_report['c_lname'];
        query = "SELECT Customer_id, C_fname, C_lname, Points_collected, SUM(Quantity_ordered*Price) AS Total_purchase FROM Orders, Customer, Food_items where Customer_id = C_id AND Item_no = Item_num AND C_fname = " + `c_fname` + " AND C_lname = " + `c_lname`;  // Build the query string
        con.query(query, function (err, result, fields) {   // Run the query
          if (err) throw err;
          console.log(result);
          var res_string = JSON.stringify(result);
          var res_json = JSON.parse(res_string);
          console.log(res_json);
    
          // Now build the response: table of results and form to do another query
          response_form = `<form action="customer_report.html" method="GET">`;
          response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
          response_form += `<td><B>Customer ID</td><td><B>Customer First Name</td><td><B>Customer Last Name</td><td><B>Customer Reward/td><td><B>Total Purchase</td>`;
          for (i in res_json) {
            response_form += `<tr><td> ${res_json[i].Customer_id}</td>`;
            response_form += `<td> ${res_json[i].C_fname}</td>`;
            response_form += `<td> ${res_json[i].C_lname}</td>`;
            response_form += `<td> ${res_json[i].Points_collected}</td>`;
            response_form += `<td> ${res_json[i].Total_purchase}</td>`;
          }
          response_form += "</table><br><br>";
          response_form += `<input type="submit" value="Generate Another Report"> </form>`;
          response.send(response_form);
        });
      }


app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
  });
  
app.post("/process_sale_report", function (request, response) { // POST request for process sales report
    let POST_sale_report = request.body;
    query_DB_sales_report(POST_sale_report, response);
  });

app.post("/process_customer_report", function (request, response) { // POST request for process customer report
let POST_customer_report = request.body;
query_DB_customer_report(POST_customer_report, response);
});

app.listen(8080, () => console.log(`listening on port 8080`));