'use strict';

import addRestaurants from './restaurantParser.js';

const getWidth = (e) => {
    let counter = 1;
    while(e.target.previousElementSibling) {
        counter++;
        e.target = e.target.previousElementSibling;
    }
    return counter;
}

$(function () {
    $('.side-nav .reset').hide();
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
        $('.side-nav .ratings .full-stars.onhover').css('width', (20 * getWidth(e)) + '%');
    }).mouseleave(() => {
        $('.side-nav .ratings .full-stars.onhover').css('width', '0%');
    }).click((e) => {
        let stars = $('.side-nav .ratings .full-stars:not(.onhover)');
        let index = getWidth(e);
        let width = '' + (index * 20) + '%';

        stars.css('width', width);
        stars.children().removeClass('selected');
        stars.children().eq(index-1).addClass('selected');
        $('.side-nav .reset').show();
        filter();
    });

    $('.price-tags li').click((e) => {
        $(e.currentTarget).toggleClass('selected');
        $('.side-nav .reset').show();
        filter();
    });

    $('tr:not(.head)').click((e) => {
        window.location.href += e.currentTarget.id;
    });

    $('.kitchen li').click((e) => {
        $('.kitchen .selected').removeClass('selected');
        e.target.classList.add('selected');
        $('.side-nav .reset').show();
        filter();
    });

    $('.side-nav .reset').click((e) => {
        $('.kitchen .container-body li.selected').removeClass('selected');
        $('.rating .full-stars i.selected').removeClass('selected');
        $('.price-tags .icon.selected').removeClass('selected');
        $(e.target).hide();
        filter(true);
    });

    function filter(reset=false) {
        //debugger;
        let url = window.location.href + '?';
        if(reset) {
            url += 'reset=true';
        } else {
            let kitchen = $('.kitchen .selected').text();
            let rating = $('.rating .full-stars i').index($('.rating .selected')) + 1;
            let priceTag = '';
            $('.price-tags .selected').each((id, el) => {
                priceTag += el.classList[1] + '-';
                console.log(typeof el.classList[1]);
            });
            priceTag = priceTag.slice(0, -1);
            if(kitchen) {
                url += 'kitchen=' + kitchen;
            }
            if(rating) {
                url += url.slice(-1) === '?' ? 'rating=' + rating : '&rating=' + rating;
            }
            if(priceTag !== '') {
                url += url.slice(-1) === '?' ? 'pricetag=' + priceTag : '&pricetag=' + priceTag;
            }
            console.log(url);
        }
        fetch(url).then(response => response.json())
            .then(data => addRestaurants(data))
            .catch(error => console.error(error));
    }
});