document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("time");

    const texts = [
        "We'll be back soon!",
        "Thank you for your patience.",
        "Improving the website experience...",
        "Maintenance in progress."
    ];

    let index = 0;

    setInterval(() => {
        index = (index + 1) % texts.length;
        message.textContent = texts[index];
    }, 3000);
});