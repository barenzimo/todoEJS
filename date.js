module.exports.getDate = getDate;

function getDate() {
  let today = new Date();
  // logic of get request
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let date = today.toLocaleDateString("en-US", options);

  return date;
}

module.exports.getDay = getDay;

function getDay() {
  let today = new Date();
  // logic of get request
  var options = {
    weekday: "long",
  };

  let date = today.toLocaleDateString("en-US", options);

  return date;
}
