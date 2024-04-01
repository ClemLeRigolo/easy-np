// Display group-navigation css
function setShowMenu(value) {
    // Get the element with class name "group-navigation"
    const groupNavigation = document.querySelector('.group-navigation');
    // If the element exists
    if (groupNavigation) {
        // Set the element's style display to the value passed
        groupNavigation.style.display = value ? 'block' : 'none';
    }
}