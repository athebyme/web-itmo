document.addEventListener("DOMContentLoaded", function() {
    console.log("скрипт запущен");

    const links = document.querySelectorAll(".nav__link");
    console.log("количество найденных ссылок:", links.length);

    const currentPath = window.location.pathname === "/" ? "/index.html" : window.location.pathname;
    console.log("текущий путь:", currentPath);

    let activeLinkFound = false;

    links.forEach(link => {
        const linkPath = link.getAttribute("href").startsWith("#")
            ? link.getAttribute("href")
            : new URL(link.href, window.location.origin).pathname;

        console.log("сравниваем:", linkPath, "с", currentPath);

        if (!activeLinkFound && (linkPath === currentPath || linkPath === window.location.hash)) {
            console.log("active для:", link.href);
            link.classList.add("active");
            activeLinkFound = true;
        }
    });
});