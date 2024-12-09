document.addEventListener('DOMContentLoaded', () => {
    // Определяем текущий путь
    const path = window.location.pathname;

    // Логика для добавления класса active на текущую страницу
    if (path.includes('index.html')) {
        document.getElementById('home-link').classList.add('active');
    } else if (path.includes('stats.html')) {
        document.getElementById('stats-link').classList.add('active');
    } else if (path.includes('constructor.html')) {
        document.getElementById('constructor-link').classList.add('active');
    } else if (path.includes('wildberries.html')) {
        document.getElementById('wildberries-link').classList.add('active');
    }

    // Инициализация мобильного меню Bootstrap
    var navbarToggler = document.querySelector('.navbar-toggler');
    navbarToggler.addEventListener('click', function() {
        var navbarNav = document.getElementById('navbarNav');
        navbarNav.classList.toggle('show');
    });
});