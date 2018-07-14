const lightStylesheet = 'styles/styles.css';
const darkStylesheet = 'styles/styles_dark.css';
const toggleDarkMode = $('#toggle-dark-mode');
// const toggleDarkMode = document.querySelector('#toggle-dark-mode');
var isDarkModeOn = false; // dark mode is off by default

// toggleDarkMode.addEventListener('click', () => {
//     if (isDarkModeOn == false) {
//         document.querySelector('#stylesheet').href = darkStylesheet;
//         isDarkModeOn = true;
//         console.log('Dark Mode is now on');
//     }
//     else {
//         document.querySelector('#stylesheet').href = lightStylesheet;
//         isDarkModeOn = false;
//         console.log('Dark Mode is now off');
//     }
// });

$('#toggle-dark-mode').click(function() {
    if (isDarkModeOn == false) {
        $('#dark-mode-icon').animate({  borderSpacing: 180 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)'); 
              $(this).css('-moz-transform','rotate('+now+'deg)');
              $(this).css('transform','rotate('+now+'deg)');
            },
            duration:'slow'
        },'linear');

        $('#stylesheet').attr('href', darkStylesheet);
        isDarkModeOn = true;
        console.log('Dark Mode is now on');
    }
    else {
        $('#dark-mode-icon').animate({  borderSpacing: -180 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)'); 
              $(this).css('-moz-transform','rotate('+now+'deg)');
              $(this).css('transform','rotate('+now+'deg)');
            },
            duration:'slow'
        },'linear');

        $('#stylesheet').attr('href', lightStylesheet);
        isDarkModeOn = false;
        console.log('Dark Mode is now off');
    }
})