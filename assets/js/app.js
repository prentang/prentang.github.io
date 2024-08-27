document.addEventListener("DOMContentLoaded", function() {
  // Nav selections
  const burger = document.querySelector("#burger-menu");
  const ul = document.querySelector("nav ul");
  const nav = document.querySelector("nav");

  // Scroll to top selection
  const scrollUp = document.querySelector("#scroll-up");

  // Select nav links
  const navLink = document.querySelectorAll(".nav-link");

  //  menu function
  burger.addEventListener("click", () => {
    ul.classList.toggle("show");
  });

  // Close menu when a link is clicked
  navLink.forEach((link) =>
    link.addEventListener("click", () => {
      ul.classList.remove("show");
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
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      nav.style.top = `-${burger.offsetHeight}px`;
    } else {
      nav.style.top = "0";
    }
  });
});