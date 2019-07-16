import {options} from '../searchEngine.js';
import userMenu from '/javascripts/user-menu.js';

$(function(){
    //console.log(document.forms['comment-form'].action);
    $.typeahead(options);
    userMenu();
    $('#nav-button').click(navToggle);
    $('.nav-menu li:not(.back)').click(getDetails);
    $('#popup-display').on('click', () => {
        $('.popup').removeClass('hidden');
    });
    $('#cancel').on('click', (e) => {
        e.preventDefault();
        $('.popup').addClass('hidden');
    });
    $('#comment-form').on('submit', checkNav());
    $('.favourite-button').on('click', function (e) {
        let url = window.location.href.replace(/(.*)\/[a-z]+$/, '$1/favourite' );
        fetch(url).then(response => {return response.json()})
            .then(data => {
                alert(data.message);
                $(this).toggleClass('in-favourites');
                $(this).text(function (i, text) {
                    return text === 'Usuń z ulubionych' ? 'Dodaj do ulubionych' : 'Usuń z ulubionych';
                });
            });
    });
});

function checkNav() {
    return function () {
        let sideNav = $('.side-nav');
        let marginSize = sideNav.css('margin-left') === '0px' ? '0' : '-25';
        document.forms['comment-form'].action += '?nav=' + marginSize;
        return true;
    }
}

function navToggle() {
    console.log('działa');
    if($('.side-nav').css('margin-left') === '0px') {
        $('.side-nav').animate({
            marginLeft: '-25%'
        }, 400);
        $('.restaurant-details').animate({
            marginLeft: '0'
        }, 400);
        $('.info').css('flex-basis', '50%');
        $('#map').css('flex-basis', '50%');
    } else {
        $('.side-nav').animate({
            marginLeft: '0'
        }, 400);
        $('.restaurant-details').animate({
            marginLeft: '25%'
        }, 400);
        $('.info').css('flex-basis', '75%');
        $('#map').css('flex-basis', '100%');
    }
}

function getDetails(e) {
    let url = window.location.href.match(/.*\/restaurants\/details\/[^\/]*/g);
    let sideNav = $('.side-nav');
    let marginSize = sideNav.css('margin-left') === '0px' ? '0' : '-25';
    switch(e.currentTarget.innerText) {
        case 'Menu':
            url += '/menu';
            break;
        case 'Opinie':
            url += '/opinions';
            break;
        case 'Informacje':
            url += '/information';
            break;
    }
    window.location.href = url + '?nav=' + marginSize;
}