// declares variables
let items = document.querySelectorAll('.carousel .carouselItem');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let width = window.innerWidth;
let willLoop = !document.getElementById('contact-carousel');

let ftl = false;
let ltf = false;

let active = 0;
/*
    creates function to load the items (types of sponsorships) in the carousel and create a blur and perspective effect
    for items not in focus. it allows the user to see the focused item at ease while the previous and next items are
    blurred, scaled, and rotated in the back of the focused item 
*/
function loadShow(isBig){
    let index = 0;
    // using the "active" index, configure styles for the single item correlating to the index
    items[active].style.transform = `none`;
    items[active].style.zIndex = 1;
    items[active].style.filter = 'none';
    items[active].style.opacity = 1;
    items[active].style.display = '';
    // for loop to configure the items that are to the right of the current item
    if(isBig && !ltf && !ftl){
        for(var i = active + 1; i < items.length; i++){
            index++;
            // as i increases from current index to rightmost index, it configures the style for each index
            if(!document.getElementById('contact-carousel') && index <= 1) {
                items[i].style.transform = `translateX(${120*index}px) scale(${1 - 0.2*index}) perspective(16px) rotateY(-1deg)`;
            } else if (index <= 1) {
                items[i].style.transform = `translateX(${120*index}px) scale(${1 - 0.5*index}) perspective(16px) rotateY(-1deg)`;
            }
            items[i].style.zIndex = -index;
            items[i].style.filter = 'blur(5px)';
            // the "index > 1" is treated as a condition, the "?" means that the opacity will be set to 0 if the condition 
            // is true, while the ":" means else, where 0.6 will be set as the opacity if the condition is false
            items[i].style.opacity = index > 1 ? 0 : 0.6;
        }
        // reset the index, and configure the items to the left of the current item
        index = 0;
        for(var i = active - 1; i >= 0; i--){
            index++;
            if(!document.getElementById('contact-carousel') && index <= 1) {
                items[i].style.transform = `translateX(${-120*index}px) scale(${1 - 0.2*index}) perspective(16px) rotateY(1deg)`;
            } else if (index <= 1) {
                items[i].style.transform = `translateX(${-120*index}px) scale(${1 - 0.5*index}) perspective(16px) rotateY(1deg)`;
            }
            items[i].style.zIndex = -index;
            items[i].style.filter = 'blur(5px)';
            items[i].style.opacity = index > 1 ? 0 : 0.6;
        }
    } else {
        for(var i = 0; i < items.length; i++){
            if(i == active) {
                continue;
            } else {
                items[i].style.opacity = 0;
                items[i].style.transform = ``;
                // items[i].style.display = 'none'; // alt solution to oursponsors carousel stack problem
            }
        }
        if(!document.getElementById('sponsors-carousel')){
            if(ftl){
                console.log('running front to last');
                items[items.length-2].style.transform = `translateX(${-120}px) scale(${!document.getElementById('contact-carousel') ? (1 - 0.2) : (1 - 0.5)}) perspective(16px) rotateY(1deg)`;
                items[items.length-2].style.zIndex = -1;
                items[items.length-2].style.filter = 'blur(5px)';
                items[items.length-2].style.opacity = 0.6;
            } else if (ltf) {
                items[1].style.transform = `translateX(${120}px) scale(${!document.getElementById('contact-carousel') ? (1 - 0.2) : (1 - 0.5)}) perspective(16px) rotateY(-1deg)`;
                items[1].style.zIndex = -1;
                items[1].style.filter = 'blur(5px)';
                items[1].style.opacity = 0.6;
            }
        }
        ftl = ltf = false;
    }
}

// runs the function show the design on load
function loadCorrectCarousel() {
    if(items.length < 3) { 
        loadShow(false);
    } else {
        width = window.innerWidth;
        loadShow(width > 850);
    }
}

loadCorrectCarousel();

window.addEventListener('resize', loadCorrectCarousel);
// runs following fuction if the next button is clicked
next.onclick = function(){
    // ftltf -> first to last / last to first, fixes odd transition
    ltf = active + 1 >= items.length;
    active = active + 1 < items.length ? active + 1 : (active = 0);
    loadCorrectCarousel();
}
// runs following function if the previous button is clicked
prev.onclick = function(){
    ftl = active - 1 < 0;
    active = active - 1 >= 0 ? active - 1 : (active = items.length-1);
    loadCorrectCarousel();
}

function loopChangeItem() {
    if(!document.getElementById('support-carousel')){ // sets 5 second timeout for our sponsors page
        setTimeout(loopChangeItem, 5000); // adjust milliseconds to time until change
    } else { // sets 3 second timeout for support types carousel
        setTimeout(loopChangeItem, 3000); 
    }
    ltf = active + 1 >= items.length;
    active = active + 1 < items.length ? active + 1 : (active = 0);
    loadCorrectCarousel();
}
if(willLoop) {
    active = -1;
    loopChangeItem();
}