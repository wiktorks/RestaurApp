$(function(){
    // $('#search-restaurants').submit(submitter);
    $('#nav-button').click(navToggle);

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