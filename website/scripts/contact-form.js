// when the form is submitted, the following function will run
document.getElementById("contact-form").addEventListener("submit", function(event) {
    // condition runs function that validates form and checks if everything is filled correctly
    if (!validateForm()) {
        // prevents form submission
        event.preventDefault();
        // displays error message
        alert("Please fill in all required fields correctly.");
    } else if (validateForm()) {
        event.preventDefault();
        // stores form data into Google Sheets using Google App Script
        try{
            var formData = new FormData(document.getElementById("contact-form"));
            var xhr = new XMLHttpRequest(); // creates a new XMLHttpRequest object
            // running the Google App Script that will parse and store all form data
            xhr.open("POST", "https://script.google.com/macros/s/AKfycbx2526-ouTB6kTPGYadm2JUvBafpkAQRHBTXN3HySgDcdX4XwrElwOPXNiKF0NtSbQ8iQ/exec?function=contactForm", true); // Specify the URL of your Google Apps Script
            xhr.send(formData); // sends form data asynchronously
            alert("Message sent successfully!");
            clearForm();
             
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
});

/*
    creates function to validate form and check to see if all input boxes are filled, radio
    buttons are checked, and that inputs are following criteria. it then returns true or false
    based on if the form is valid or not.
*/
function validateForm(){
    // declares variables
    // initiate "inputs" variable with an array containing all input elements in the form
    var inputs = document.getElementById("contact-form").querySelectorAll("input");
    var smalls = document.querySelectorAll("small");
    var check = true;

    // for loop to parse through the array of all the inputs in the form
    for (var i = 0; i < inputs.length; i++) {
        // try,catch is used to log an error in case something happens in the try block
        try {
            var input = inputs[i];
// condition to check if input is not a radio type, is not empty, and is required
            if (input.type !== "radio" && input.value.trim() === "" && input.classList.contains("required")) {
                // if true, runs code to show error
                var errorId = input.id + "Empty";
                input.style.border = "2px solid red";
                document.getElementById(errorId).classList.remove("hidden");
                check = false;
            }
        } catch (error) {
            // logs error in case something happens in try block
            console.error("An error occurred:", error);
        }
    }

    var textarea = document.getElementById("conMessage");

    if (textarea.value.trim() == ""){
        var errorId = textarea.id + "Empty";
        textarea.style.border = "2px solid red";
        document.getElementById(errorId).classList.remove("hidden");
        check = false;
    }

    // checks to see if all small elements (the error messages) are hidden
    smalls.forEach(function (small){
        if(!small.classList.contains("hidden")){ // if not, form is not validated
            check = false;
        }
    });
    // returns true or false, based on if the form is validated or not
    return check;

}

function clearForm() {
    var name = document.getElementById("conFullName");
    var email = document.getElementById("conEmail");
    var message = document.getElementById("conMessage");
    name.value = "";
    email.value = "";
    message.value = "";
}