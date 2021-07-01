const express = require("express");
const dateOfToday = require(__dirname + "/date.js");
const mongoose = require("mongoose");
let day;
let items = ["Raja", "Mia"];
let itemsWork = [];

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// ----------------------Connecting to database-----------------------------
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const itemsSchema = {
  name: String,
};
//default utems in Item model
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your todoList!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete items",
});
const defaultItems = [item1, item2, item3];

//loggind database

// ----------------------Home route-----------------------------
app.get("/", (req, res) => {
  date = dateOfToday.getDate();
  //Note-- we're not passing the Item, first finding it then passing
  Item.find({}, (err, elements) => {
    if (elements.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        err ? console.log(err) : console.log("Successfully inserted");
      });
      res.redirect("/");
    } else res.render("list", { listTitle: date, items: elements });
  });
});

app.post("/", (req, res) => {
  const newItemPost = req.body.newItem;
  Item.create({ name: newItemPost }, (err) =>
    err ? console.log(err) : console.log("Inserted New Item")
  );
  res.redirect("/");
});

//---------------- Delete route for todo------------------------
app.post("/delete", (req, res) => {
  console.log(req.body);
  Item.deleteOne({ _id: req.body.checkbox }, (err) => console.log(err));
  res.redirect("/");
});

//---------------- WOrk route------------------------
app.get("/work", (req, res) =>
  res.render("list", { listTitle: "Work", items: itemsWork })
);

//---------------- About route------------------------
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server has been started");
});
