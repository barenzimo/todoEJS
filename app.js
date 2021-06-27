const express = require("express");
const dateOfToday = require(__dirname + "/date.js");
let day;
let items = ["Buy milk", " Buy food", "Eat food"];
let itemsWork = [];

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ----------------------Home route-----------------------------
app.get("/", (req, res) => {
  date = dateOfToday.getDate();
  //   rendering to ejs files
  res.render("list", { listTitle: date, items: items });
});

app.post("/", (req, res) => {
  if (req.body.list == "Work") {
    itemsWork.push(req.body.newItem);
    res.redirect("/work");
    console.log(req.body.list);
  } else {
    items.push(req.body.newItem);
    res.redirect("/");
  }
});

//---------------- WOrk route------------------------
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", items: itemsWork });
});

//---------------- About route------------------------
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server has been started");
});
