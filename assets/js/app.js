document.addEventListener("DOMContentLoaded", function() {
  // Nav selections
  const burger = document.querySelector("#burger-menu");
  const ul = document.querySelector("nav ul");
  const nav = document.querySelector("nav");

  // Scroll to top selection
  const scrollUp = document.querySelector("#scroll-up");

  // Select nav links
  const navLink = document.querySelectorAll(".nav-link");

  // Toggle menu function
  burger.addEventListener("click", () => {
    ul.classList.toggle("show");
    document.body.classList.toggle("menu-open"); // Add/remove overflow on body
  });

  // Close menu when a link is clicked
  navLink.forEach((link) =>
    link.addEventListener("click", () => {
      ul.classList.remove("show");
      document.body.classList.remove("menu-open"); // Unlock body scroll
    })
  );

  // scroll to top functionality
  scrollUp.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  // Adjust the position of the hamburger menu when scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  });
});