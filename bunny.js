// bunny.js

document.addEventListener("DOMContentLoaded", () => {
  // Create speech bubble
  const speech = document.createElement("div");
  speech.id = "bunny-speech";
  speech.textContent = "Hi there!";
  document.body.appendChild(speech);

  // Create bunny image
  const bunny = document.createElement("img");
  bunny.id = "pet-bunny";
  bunny.src = "bunny.png"; // Make sure this matches your file
  bunny.alt = "Pet Bunny";
  document.body.appendChild(bunny);

  const bunnyQuotes = [
    "You're doing amazing! 🌟",
    "Don't forget to take a break 🫖",
    "One step at a time 🐾",
    "Let's finish that task! ✅",
    "Proud of you! 💖",
    "Keep hopping forward! 🐇",
    "You got this! 🚀"
  ];

  bunny.addEventListener("click", () => {
    const randomQuote = bunnyQuotes[Math.floor(Math.random() * bunnyQuotes.length)];
    speech.textContent = randomQuote;

    // Show speech bubble
    speech.style.opacity = 1;
    speech.style.transform = "translateY(0)";

    // Hide after 3 seconds
    setTimeout(() => {
      speech.style.opacity = 0;
      speech.style.transform = "translateY(10px)";
    }, 3000);
  });
});
bunny.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent double triggering
  showBunnyMessage();
});

// Show message on any screen click
document.addEventListener("click", () => {
  showBunnyMessage();
});
