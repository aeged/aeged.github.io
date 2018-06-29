const lightStylesheet = 'styles.css';
const darkStylesheet = 'styles_dark.css';
const toggleDarkMode = document.querySelector('button');
var isDarkModeOn = false; // dark mode is off by default

toggleDarkMode.addEventListener('click', () => {
    if (isDarkModeOn == false) {
        document.querySelector('#stylesheet').href = darkStylesheet;
        isDarkModeOn = true;
        console.log('Dark Mode is now on');
    }
    else {
        document.querySelector('#stylesheet').href = lightStylesheet;
        isDarkModeOn = false;
        console.log('Dark Mode is now off');
    }
});