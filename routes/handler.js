var express = require("express");
const fs = require("fs");

var router = express.Router();
var spawn = require("child_process").spawn;

var path = require("path");
//var queries = require(path.join(__dirname,'../model/queries'));
// const mime = require('mime');
var request = require("request");
//var query = require('.././model/queries');

fs.openSync("assets/activity.json", "w");

const MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
var app = express();
const uri =
  "mongodb+srv://panu123:1234@cluster0-rjwue.mongodb.net/Finlit?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

MongoClient.connect(
  uri,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    const db = client.db("Finlit");
    const collection = db.collection("Questions");

    db.collection("Questions")
      .find()
      .toArray()
      .then((results) => {
        const jsonString = JSON.stringify(results);
        fs.writeFileSync(
          "assets/activity.json",
          '{"quizlist":' + jsonString + "}"
        );
        console.log(results);
      })
      .catch((error) => console.error(error));
    console.log("Connected to Database");
  }
);

//Landing Page
router.get("/", (req, res) => {
  res.render("landing", { layout: "landing.handlebars" });
});

//First Quiz
router.get("/first_quiz", (req, res) => {
  res.render("first_quiz", { layout: "first_quiz.handlebars" });
});

//Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { layout: "dashboard.handlebars" });
});

//Banking Quiz
router.get("/banking", (req, res) => {
  res.render("second_quiz", { layout: "second_quiz.handlebars" });
});

//Tax Quiz
router.get("/tax", (req, res) => {
  res.render("second_quiz", { layout: "second_quiz.handlebars" });
});

// Function callName() is executed whenever
// url is of the form localhost:3000/name
router.get("/ip", (req, res) => {
  // Use child_process.spawn method from child_process module and assign it to variable spawn
  // Parameters passed in spawn:
  // 1. type of script
  // 2. list containing path of the script and arguments for the script

  var process = spawn("python", [
    "./user_class.py",
    req.query.q1,
    req.query.q2,
    req.query.q3,
    req.query.q4,
    req.query.q5,
    req.query.q6,
    req.query.q7,
    req.query.q8,
    req.query.q9,
  ]);

  // Takes stdout data from script which executed
  // with arguments and send this data to res object
  process.stdout.on("data", function (data) {
    console.log(data.toString());
    res.send(data);
  });
});

// To run the fuzzy script
router.get("/fuzzy", (req, res) => {
  console.log(req.query.score);
  console.log(req.query.cl);
  var process = spawn("python", [
    "./finlit_fuzzy.py",
    req.query.score,
    req.query.cl,
  ]);

  process.stdout.on("data", function (data) {
    console.log(data.toString());
    res.send(data);
  });
});

module.exports = router;

