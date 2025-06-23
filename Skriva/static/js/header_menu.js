document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('header-icon_bars');
    const userIcon = document.getElementById('header-icon_user');
    const menuBars = document.getElementById('header_menu_bars');
    const menuUser = document.getElementById('header_menu_user_icon');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menuBars.classList.toggle('active');
        menuUser.classList.remove('active');
    });

    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        menuUser.classList.toggle('active');
        menuBars.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!menuBars.contains(e.target) && !menuButton.contains(e.target)) {
            menuBars.classList.remove('active');
        }
        if (!menuUser.contains(e.target) && !userIcon.contains(e.target)) {
            menuUser.classList.remove('active');
        }
    });

    darkModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
    });
});