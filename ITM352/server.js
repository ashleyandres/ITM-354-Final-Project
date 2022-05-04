var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');

console.log("Connecting to localhost..."); 
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: 3306,
  database: "Shabuya_Database",
  password: ""
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

function query_DB_sales_report(POST_sale_report, response) { // function for process_sales_report_query
      beg_date = POST_sale_report['report_beg_date'];      // Grab the parameters from the submitted form
      end_date = POST_sale_report['report_end_date'];
      report_year = POST_sale_report['report_year'];
      report_month = POST_sale_report['report_month'];
      query = "SELECT Total, C_fname, C_lname, Order_number, Customer_activity_year, Customer_activity_month, Customer_activity_day FROM total_order_info WHERE Customer_activity_day >=" + beg_date + " AND Customer_activity_day <=" + end_date + " AND Customer_activity_month =" + report_month + " AND Customer_activity_year = " + report_year;  // Build the query string

      con.query(query, function (err, result, fields) {   // Run the query
        if (err) throw err;
        console.log(result);
        var res_string = JSON.stringify(result);
        var res_json = JSON.parse(res_string);
        console.log(res_json);


        // Now build the response: table of results and form to do another query
        response_form = `<form action="managerinput.html" method="GET">`;
        response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
        response_form += `<td><B>Order Number</td><td><B>Customer Name</td><td><B>Total</td><td><B>Customer Activity Date</td>`;

        for (i in res_json) {
          response_form += `<tr><td> ${res_json[i].Order_number}</td>`;
          response_form += `<td> ${res_json[i].C_fname} ${res_json[i].C_lname}</td>`;
          response_form += `<td> ${res_json[i].Total.toFixed(2)}</td>`;
          response_form += `<td> ${res_json[i].Customer_activity_year}-${res_json[i].Customer_activity_month}-${res_json[i].Customer_activity_day}</td>`;
        }
        response_form += "</table>";
        response_form += `<input type="submit" value="Generate Another Report"> </form>`;
        response.send(response_form);
      });
    }

    function query_DB_customer_report(POST_customer_report, response) { // function for process_customer_report_query
        c_fname = POST_customer_report['c_fname'];      // Grab the parameters from the submitted form
        c_lname = POST_customer_report['c_lname'];
        query = "SELECT C_number, C_fname, C_lname, Total_point, Total_order FROM Customer_report WHERE C_fname = " + c_fname + " AND C_lname = " + c_lname;  // Build the query string
        con.query(query, function (err, result, fields) {   // Run the query
          if (err) throw err;
          console.log(result);
          var res_string = JSON.stringify(result);
          var res_json = JSON.parse(res_string);
          console.log(res_json);
    
          // Now build the response: table of results and form to do another query
          response_form = `<form action="customer_report.html" method="GET">`;
          response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
          response_form += `<td><B>Customer ID</td><td><B>Customer First Name</td><td><B>Customer Last Name</td><td><B>Customer Reward</td><td><B>Total Purchase</td>`;
          for (i in res_json) {
            response_form += `<tr><td> ${res_json[i].C_number}</td>`;
            response_form += `<td> ${res_json[i].C_fname}</td>`;
            response_form += `<td> ${res_json[i].C_lname}</td>`;
            response_form += `<td> ${res_json[i].Total_point}</td>`;
            response_form += `<td> ${res_json[i].Total_order.toFixed(2)}</td>`;
          }
          response_form += "</table><br><br>";
          response_form += `<input type="submit" value="Generate Another Report"> </form>`;
          response.send(response_form);
        });
      }

      function query_DB_topseller_report(POST_topseller_report, response) { // function for process_top_seller_report_query
        Service_type = POST_topseller_report['type_of_service'];      // Grab the parameters from the submitted form
        Seller_date = POST_topseller_report['seller_date'];
        query_topseller = "SELECT Item_num, Item_name, Type_of_service, SUM(Quantity_ordered) AS total_quantity FROM Food_items, Orders WHERE Item_no = Item_num AND Type_of_service = '$Service_type'";  // Build the query string WHERE Item_num = Item_no AND Type_of_service = '$Service_type'
        con.query(query_topseller, function (err, result, fields) {   // Run the query
          if (err) throw err;
          console.log(result);
          var res_string = JSON.stringify(result);
          var res_json = JSON.parse(res_string);
          console.log(res_json);
    
          // Now build the response: table of results and form to do another query
          response_form = `<form action="topseller.html" method="GET">`;
          response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
          response_form += `<td><B>Food Item ID</td><td><B>Food Item Name</td><td><B>Type of Service</td><td><B>Total Quantity</td>`;
          for (i in res_json) {
            response_form += `<tr><td> ${res_json[i].Item_num}</td>`;
            response_form += `<td> ${res_json[i].Item_name}</td>`;
            response_form += `<td> ${res_json[i].Type_of_service}</td>`;
            response_form += `<td> ${res_json[i].total_quantity}</td>`;
          }
          response_form += "</table><br><br>";
          response_form += `<input type="submit" value="Generate Another Report"> </form>`;
          response.send(response_form);
        });
      }

      function query_DB_employee_contact(POST_employee_contact, response) { // function for process_top_seller_report_query
        store_location = POST_employee_contact['store_location'];      // Grab the parameters from the submitted form
        query_employee_contact = "SELECT * FROM Employee";  // Build the query string WHERE Item_num = Item_no AND Type_of_service = '$Service_type'
        con.query(query_employee_contact, function (err, result, fields) {   // Run the query
          if (err) throw err;
          console.log(result);
          var res_string = JSON.stringify(result);
          var res_json = JSON.parse(res_string);
          console.log(res_json);
    
          // Now build the response: table of results and form to do another query
          response_form = `<form action="topseller.html" method="GET">`;
          response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
          response_form += `<td><B>Store Location</td><td><B>Employee ID</td><td><B>Employee First Name</td><td><B>Employee Last Name</td><td><B>Phone Number</td><td><B>Address</td>`;
          for (i in res_json) {
            response_form += `<tr><td> ${store_location}</td>`;
            response_form += `<td> ${res_json[i].Employee_Id}</td>`;
            response_form += `<td> ${res_json[i].E_fname}</td>`;
            response_form += `<td> ${res_json[i].E_lname}</td>`;
            response_form += `<td> ${res_json[i].E_phone}</td>`;
            response_form += `<td> ${res_json[i].E_address}</td>`;
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

app.post("/process_employee_contact", function (request, response) { // POST request for process customer report
  let POST_employee_contact = request.body;
  query_DB_employee_contact(POST_employee_contact, response);
  });


app.post("/process_topseller_report", function (request, response) { // POST request for process customer report
  let POST_topseller_report = request.body;
  query_DB_topseller_report(POST_topseller_report, response);
  });

app.listen(8080, () => console.log(`listening on port 8080`));