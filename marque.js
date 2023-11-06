// Once the document is loaded
document.addEventListener("DOMContentLoaded", function() {

    // Determine the width of a single footer item (including its margins)
    const footerItem = document.querySelector('.footer-item');
    const footerItemWidth = footerItem.offsetWidth + parseInt(getComputedStyle(footerItem).marginRight);

    // Calculate the total distance to move (half since you have two repeating sets of footer items)
    const totalDistance = footerItemWidth * (document.querySelectorAll('.footer-item').length / 2);

    // Set up the GSAP animation
    const marqueeAnimation = gsap.to(".list", {
        x: -totalDistance, // move left by totalDistance
        duration: 400, // this determines the speed; adjust as needed
        repeat: -1, // infinite repeats
        ease: "none" // linear movement
    });

});
