const year = document.querySelector("#year");

const dt = new Date();

const html = `${dt.getFullYear()}`;

year.insertAdjacentHTML("beforeend", html);
