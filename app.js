const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
mongoose.set("useFindAndModify", false);
// ----------------------Connecting to database-----------------------------
mongoose.connect(
  "mongodb+srv://admin-aman:Test123@cluster0.3bf5d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const itemsSchema = {
  name: String,
};
//default items in Item model
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
// database for custom route
const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model("List", listSchema);

// ----------------------Home route-----------------------------
app.get("/", (req, res) => {
  res.redirect("/home");
});

// ----------------------Custom route-----------------------------
app.get("/:paramName", (req, res) => {
  const listName = _.capitalize(req.params.paramName);
  // displaying the custom list items
  List.findOne({ name: listName }, (err, foundItems) => {
    if (!foundItems) {
      // creating a custom list item
      const customListItem = new List({ name: listName, items: defaultItems });
      customListItem.save();
      res.redirect("/" + listName);
    } else {
      // showing an existing list

      res.render("list", { listTitle: listName, items: foundItems.items });
    }
  });
});

//---------------- Post route for todo------------------------
app.post("/", (req, res) => {
  const newListItem = req.body.newItem;
  const listName = req.body.list;
  //inserting the passed value into collection
  //to push an array, it has to be of items schema
  const item = new Item({ name: newListItem });
  //now pushing this array into collection
  List.findOne({ name: listName }, (err, foundItem) => {
    foundItem.items.push(item);
    foundItem.save();
    res.redirect("/" + listName);
  });
});

//---------------- Delete route for todo------------------------
app.post("/delete", (req, res) => {
  console.log(req.body);
  const listName = req.body.listName;
  const id = req.body.checkbox;

  List.findOneAndUpdate(
    { name: listName },
    { $pull: { items: { _id: id } } },
    function (err, list) {
      if (!err) {
        res.redirect("/" + listName);
      }
    }
  );
  // Item.deleteOne({ _id: req.body.checkbox }, (err) => console.log(err));
  // res.redirect("/");
});

//---------------- About route------------------------
app.get("/about", (req, res) => {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("Server has been started");
});
