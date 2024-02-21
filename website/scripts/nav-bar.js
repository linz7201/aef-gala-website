/*
  creates function for a responsive menu button that opens when a button
  is pressed in the html file. used for the hamburger menu when a user
  uses a smaller device, and the navbar changes format
*/
function onMenuClick() {
  // logs message when function is run
  console.log("Menu button clicked!");
  // declare variable
  var x = document.getElementById("navbar");
  // checks to see if navbar is in its header state
  if (x.className === "header") {
    // if yes, the navbar will go to its responsive state
    x.className += " responsive";
  } else {
    // no, the navbar will go to its header state
    x.className = "header";
  }
}