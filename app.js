//Auto Generate nav and foot

document.getElementById("nav").innerHTML = `
    <a href="index.html">Home</a>
    |
    <a href="about.html">About</a>
    |
    <a href="weather.html">Weather</a>
    |
    <a href="alerts.html">Alerts</a>
    |
    <a href="radar.html">Radar</a>
`;


var footerElements = document.querySelectorAll("footer");
footerElements.forEach(function(footerElements) {
    footerElements.innerHTML =
`
&copy; 2023 Weather Portal | <a href="disclaimers.html">Disclaimers</a> | <a href="contact.html">Contact:</a> <a href="mailto:samuel.kinaitis@gmail.com">samuel.kinaitis@gmail.com</a>
`; 
});



//Moving Navbar
window.addEventListener('scroll', function() {
    var nav = document.getElementById('nav');
    var scrollTop = document.documentElement.scrollTop;

    // Check if user has scrolled beyond the navigation menu
    if (scrollTop > nav.offsetTop) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });