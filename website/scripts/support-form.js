// declare variables
const donateChoice = document.getElementById("donateRadio");
const sponsorChoice = document.getElementById("sponsorRadio");

// checks when the radio button is changed, and if so, run the function, showForm()
donateChoice.addEventListener("change", showForm);
sponsorChoice.addEventListener("change", showForm);

// declare variable for customAmount input box and runs function if input is changed
const customAmount = document.getElementById("customAmount");
customAmount.addEventListener("change", showSponsorshipLevel);

/*
    creates function to detect which type of support the user wants to give, and thus shows
    a unique form corresponding to the type they chose.
*/
function showForm(){
    // declare variables
    const donateForm = document.getElementById("donateChoice");
    const donateInputs = donateForm.querySelectorAll("input");
    const donateSmalls = donateForm.querySelectorAll("small");
    const sponsorForm = document.getElementById("sponsorChoice");
    const sponsorInputs = sponsorForm.querySelectorAll("input");
    const sponsorSmalls = sponsorForm.querySelectorAll("small");
    // condition to check if donate form is chosen
    if (document.getElementById("donateRadio").checked == true) {
        // if true, it unhides the donate form and hides the sponsor form
        donateForm.classList.remove("hidden");
        sponsorForm.classList.add("hidden");
        // then it unhides the donate inputs and hides the sponsor inputs
        // (needed for validation)
        donateInputs.forEach(function (input){
            input.classList.remove("hidden");
        });
        sponsorInputs.forEach(function (input){
            input.classList.add("hidden");
        });
        // and hides the error messages for the sponsor form (also for validation)
        sponsorSmalls.forEach(function(small){
            small.classList.add("hidden");
        });
    } // checks to see if instead the sponsor form is chosen
    else if (document.getElementById("sponsorRadio").checked == true) {
        // if true, it hides donate form elements and unhides sponsor form elements
        donateForm.classList.add("hidden");
        sponsorForm.classList.remove("hidden");
        donateInputs.forEach(function (input){
            input.classList.add("hidden");
        });
        sponsorInputs.forEach(function (input){
            input.classList.remove("hidden");
        });
        donateSmalls.forEach(function (small){
            small.classList.add("hidden");
        });
    } // if none of the above is true (used when page is first loaded) 
    else {
        // then both forms and their elements are hidden
        donateForm.classList.add("hidden");
        sponsorForm.classList.add("hidden");
        donateInputs.forEach(function (input){
            input.classList.add("hidden");
        });
        sponsorInputs.forEach(function (input){
            input.classList.add("hidden");
        });
    }
}

/*
    function to show user what type of sponsorship level they qualify for
    based on their custom amount they inputed to donate.
*/
function showSponsorshipLevel(){
    // gets the value in the customAmount input box
    const value = customAmount.value;
    const sponsorType = document.getElementById("sponsorLevelType");
    // conditions to check if value qualifies for each sponsorship
    if(value >= 10000){
        sponsorType.innerHTML = "Crown Jewels Sponsor";
    } else if (value >= 5000){
        sponsorType.innerHTML = "Diamond Sponsor";
    } else if (value >= 2500) {
        sponsorType.innerHTML = "Platinum Sponsor";
    } else if (value >= 1500) {
        sponsorType.innerHTML = "Gold Sponsor";
    } else if (value >= 1000) {
        sponsorType.innerHTML = "Silver Sponsor";
    } else if (value >= 300) {
        sponsorType.innerHTML = "Bronze Sponsor";
    } else {
        sponsorType.innerHTML = "";
    } 
}

// when the form is submitted, the following function will run
document.getElementById("gala-support").addEventListener("submit", function(event) {
    // condition runs function that validates form and checks if everything is filled correctly
    if (!validateForm()) {
        // prevents form submission
        event.preventDefault();
        // displays error message to user
        alert("Please fill in all required fields correctly.");
    } else if (validateForm()) {
        event.preventDefault();
        // stores form data into Google Sheets using Google App Script
        try{
            var formData = new FormData(document.getElementById("gala-support"));
            var xhr = new XMLHttpRequest(); // creates a new XMLHttpRequest object
            // running the Google App Script that will parse and store all form data
            xhr.open("POST", "https://script.google.com/macros/s/AKfycbx2526-ouTB6kTPGYadm2JUvBafpkAQRHBTXN3HySgDcdX4XwrElwOPXNiKF0NtSbQ8iQ/exec?function=supportForm", true);
            xhr.send(formData); // sends form data asynchronously

            // redirect page to homepage
            window.location.href = "confirmation.html";
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
    var inputs = document.getElementById("gala-support").querySelectorAll("input");
    var select = document.getElementById("stateInput");
    var smalls = document.querySelectorAll("small");
    var check = true;

    // checks to see if the state is changed to a valid state and not kept at its default value
    if(select.value.trim() === ""){
        // if it's at its default value, set style to have a thick red border
        select.style.border = "2px solid red";
        check = false;
    }

    // for loop to parse through the array of all the inputs in the form
    for (var i = 0; i < inputs.length; i++) {
        // try,catch is used to log an error in case something happens in the try block
        try {
            var input = inputs[i];
            // condition to check if input is not a radio type, is not empty, is required, and is not hidden
            if (input.type !== "radio" && input.value.trim() === "" && input.classList.contains("required") && !input.classList.contains("hidden")) {
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

    // for loop to parse through the radio buttons in each group
    var groupNames = ["supportChoice", "sponsorType", "cardType"];
    for (var i = 0; i < groupNames.length; i++) {
        // runs event listener to each radio in group
        addChangeEventToRadioGroup(groupNames[i]);
        // condition to check if sponsor form is hidden and breaks if condition
        if(document.getElementById("sponsorChoice").classList.contains("hidden") && (i == 1 || i == 2) ){
            continue;
        } else {
            // selects all inputs that have the radio type, and are part of a certain group that are not hidden
            var radios = document.querySelectorAll('input[type="radio"][name="' + groupNames[i] + '"]:not(.hidden)');
            var isChecked = false;

            // checks if at least one radio in the current group is checked
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) {
                    if(radios[j].id == "customSponsor" && document.getElementById("customAmount").value.trim() === ""){
                        isChecked = false;
                        // shows error
                        document.getElementById("customAmountEmpty").classList.remove("hidden");
                        document.getElementById("customAmount").style.border = "2px solid red";
                    }
                    isChecked = true;
                    break; // if one radio is selected, immediately end for loop
                }
            }

            // if none are checked in the current group, show error message
            if (!isChecked) {
                document.getElementById(groupNames[i]+"Empty").classList.remove("hidden");
                check = false;
            } else { // else remove error message
                document.getElementById(groupNames[i]+"Empty").classList.add("hidden");
            }
        }
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

/*
    creates function to find all radio inputs part of a groupName, then adds an 
    eventListener to each radio, checking if it is changed so the error message
    can be hidden if so.
*/
function addChangeEventToRadioGroup(groupName) {
    var radios = document.querySelectorAll('input[type="radio"][name="' + groupName + '"]');
    var radioGroup = document.getElementById(groupName+"Empty");
    radios.forEach(function(radio) {
        radio.addEventListener('change', function(){
            radioGroup.classList.add("hidden");
        });
    });
}