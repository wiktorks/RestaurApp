import {options} from '../searchEngine.js';

$(function(){
    $.typeahead(options);
    $('#nav-button').click(navToggle);
    $('.nav-menu li:not(.back)').click(getDetails);
});

function navToggle() {
    if($('.side-nav').css('margin-left') === '0px') {
        $('.side-nav').animate({
            marginLeft: '-25%'
        }, 400);
        $('.restaurant-details').animate({
            marginLeft: '0'
        }, 400);
    } else {
        $('.side-nav').animate({
            marginLeft: '0'
        }, 400);
        $('.restaurant-details').animate({
            marginLeft: '25%'
        }, 400);
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