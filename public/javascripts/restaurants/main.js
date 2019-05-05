'use strict';

import addRestaurants from './restaurantParser.js';

const getWidth = (e) => {
    let counter = 1;
    while(e.target.previousElementSibling) {
        counter++;
        e.target = e.target.previousElementSibling;
    }
    return '' + (counter * 20) + '%';
}

$(function () {
    $('#search-restaurants').submit(e => {
        e.preventDefault();
        window.location.href = '/restaurants/' + e.target[0].value;
    });

    $('#nav-button').click(() => {
        if($('.side-nav').css('margin-left') === '0px') {
            $('.side-nav').animate({
                marginLeft: '-25%'
            }, 400);
            $('.restaurant-list').animate({
                marginLeft: '0'
            }, 400);
        } else {
            $('.side-nav').animate({
                marginLeft: '0'
            }, 400);
            $('.restaurant-list').animate({
                marginLeft: '25%'
            }, 400);
        }
    });

    $('.side-nav .ratings i').mouseover((e) => {
        $('.side-nav .ratings .full-stars.onhover').css('width', getWidth(e));
    }).mouseleave(() => {
        $('.side-nav .ratings .full-stars.onhover').css('width', '0%');
    }).click((e) => {
        $('.side-nav .ratings .full-stars').css('width', getWidth(e));
    });

    $('.price-tags li').click();

    $('tr:not(.head)').click((e) => {
        // let restName = e.currentTarget.getElementsByClassName('restaurant-name')[0].innerText;
        // console.log(restName.split(' ').join('-').toLowerCase());
        window.location.href += e.currentTarget.id;
        // console.dir(e.currentTarget.id);
    });

    $('.kitchen li').click((e) => {
        $('.selected').removeClass('selected');
        e.target.classList.add('selected');
        let url = window.location.href + '?' + $.param({kitchen: e.target.innerText});
        fetch(url).then(response => response.json())
            .then(data => addRestaurants(data))
            .catch(error => console.error(error));
    });
});