window.addEventListener('load', function() {
    if (localStorage.getItem('isLoggedIn')) {
        window.location.href = '../../page/index.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: '10000'
    };

    toastr.info("password : 111")
    toastr.info("username : admin")
    toastr.info("Тестовая версия. Есть вход только для админа:")

    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: '5000'
    };

    const loginForm = document.getElementById('loginForm');


    const validUsername = 'admin';
    const validPassword = '111';

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === validUsername && password === validPassword) {
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', 'true');

            // Убедитесь, что toastr доступен
            if (typeof toastr !== 'undefined') {
                toastr.success('Вы успешно вошли в систему!');
            } else {
                console.error('Toastr не загружен!');
            }

            setTimeout(function() {
                window.location.href = '../../page/index.html';
            }, 1000);
        } else {
            // Также проверяем toastr на доступность
            if (typeof toastr !== 'undefined') {
                toastr.error('Неверное имя пользователя или пароль!');
            } else {
                console.error('Toastr не загружен!');
            }
        }
    });
});
