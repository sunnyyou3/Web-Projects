
// Required imports
const express = require("express");
const bodyParser = require('body-parser');
const taskObj = require("./Javascript/TaskObject");
const path = require("path");
var AWS = require('aws-sdk');
AWS.config.region = process.env.REGION

const app = express();
// create application/json parser
app.use(bodyParser.urlencoded({
    extended: true
  }));
// For telling node.js where to look to serve files
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/Javascript/TaskObject"));
let publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// The 'database' for task
const task = [];
const words = [];
// i for keeping track of task id
let i = 0;
// GET route to return all tasks in the database
// Also the on load route
app.get("/task", function (req, res) {
    res.end(JSON.stringify(task));
})


// POST route to add a new task to the database
app.post("/task", function (req, res) {
    // Add new taskObj to database
    task[i++] = new taskObj(i , req.body.description, req.body.type, req.body.date);
    res.write(JSON.stringify({ status: 'OK' }));
    res.end();
})

// Delete route to delete tasks from the database using a query parameter
app.delete("/task/:id", function (req, res) {
    // Find matching ids and delete using splice
    for(let j = 0; j < task.length; j++){
        if(task[j] != null && task[j].id === Number(req.params.id)){
            task.splice(j, 1);
            break;
        }
    }
    res.write(JSON.stringify({ status: 'OK' }));
    res.end();
})

// Constructor class for words
class Words{
  constructor(id, word, width, height, xcor, ycor){
      this.id = id;
      this.word = word;
      this.width = width;
      this.height = height;
      this.xcor = xcor;
      this.ycor = ycor;
  }
}

app.get("/words", function (req, res) {
  res.end(JSON.stringify(words));
})

app.post("/words", function (req, res) {
  let temp = JSON.parse(req.body.words);
  for(let j = 0; j < temp.length; j++){
    words[j] = new Words(temp[j].id, temp[j].word, temp[j].width, temp[j].height, temp[j].xcor, temp[j].ycor);
  }
  res.end(JSON.stringify("words ok"));
})



// Month names --> code from given calendar.js
const monthNames = ["", "January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October",
        "November", "December"];

const today = new Date();
let month = 0;
let year = 0;
let displayDays = "";


// Request
app.get("/calendar", function (req, res) {
    res.render('calendar');
  // If not query string is given, using present month and year
  if(req.query.month === undefined && req.query.year === undefined){
    month = today.getMonth()+1;
    year = today.getFullYear();
    createCalendar(month,year);
  }else createCalendar(req.query.month,req.query.year); // Otherwise use query parameter
  res.render('calendar', {
    // ejs
    forwardMonth: `<a href="/calendar?month=${month==12?1:month+1}&year=${month==12?year+1:year}">&gt</a>`,
    forwardYear: `<a href="/calendar?month=${month}&year=${year+1}">&gt;&gt;</a>`,
    backMonth: `<a href="/calendar?month=${month==1?12:month-1}&year=${month==1?year-1:year}">&lt;</a>`,
    backYear: `<a href="/calendar?month=${month}&year=${year-1}">&lt;&lt;</a>`,
    month: req.query.month === undefined ? monthNames[month] : monthNames[req.query.month],
    year: req.query.year === undefined? year: req.query.year,
    displayDays
  });
  // reset
  displayDays="";
});


// Modified code from given calendar.js
function createCalendar(m, y){
    month = Number(m);
    year = Number(y);
    // Calculate the last day of the month taking leap year into account
    // How would you do this using the js Date object?
    if (month === 4 || month === 6 || month === 9 || month === 11)
    lastDay = 30;
    else if (month !== 2)
    lastDay = 31;
    else if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
    lastDay = 29;
    else
    lastDay = 28;
  
    // Use the day of the week number for the first day of the month to set the day
    // number of the calendar cell in the upper left corner. This will be < 1 if the 
    // cell is supposed to be blank.
    let firstDayOfMonth = new Date(year, month-1, 1);
    let dday = 1 - firstDayOfMonth.getDay();
  
    // When done is true, stop printing the calendar.
    let done = false;
    let counter = 0;
    for (let colday = 0; colday <= 36 && !done; ++colday, ++dday) {
      if(colday / 7 == counter){
        displayDays += "<tr>"; 
        counter++;
      }
      if (dday < 1) {
        displayDays += "<td> </td>";
      }
      else{
        if(isToday(month, dday, year )){
          displayDays += "<td style='background-color: #00AACC;'>" + dday + "</td>"
        }else displayDays += "<td>" + dday + "</td>";
        if(colday / 7 == counter)displayDays += "</tr>";
      }
        //out.write(sprintf(" %2d", dday));
      done = (dday === lastDay);
    }
  }
  
  // Checks if the date is today
  function isToday(m, d, y) {
    const today = new Date();
    return (
      m == today.getMonth() + 1 &&
      y == today.getFullYear() &&
      d == today.getDate()
    );
  }
  

// port
app.listen(8080);



