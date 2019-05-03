$(function () {
    // const formContainer = $('.log-register-forms');

    $('form.search').submit(function(e) {
        e.preventDefault();
        console.log('/restaurants/' + e.target[0].value);
        window.location.href = '/restaurants/' + e.target[0].value;
    });

    $('.log-register-forms').css('width', '200%');

    $('.container').each((idx, el) => {
        $(el).css({
            width: '50%',
            marginLeft: (idx * 50) + '%'
        });
    });

    $('.log-buttons .btn-log h2').click(function () {
        slideLog($(this));
    });
    $('.log-buttons .btn-reg h2').click(function () {
        slideLog($(this));
    });

    function slideLog(selected) {
        if(selected.hasClass('selected')) return;
        else {
            let discard = $('.log-buttons .btn-reg h2');
            direction = 'right';
            if(selected.parents('.btn-reg').length) {
                discard = $('.log-buttons .btn-log h2');
                direction = 'left';
            }
            discard.removeClass('selected');
            selected.addClass('selected');
            $('.log-register-forms').animate({
                'margin-left': direction === 'left' ? '-100%' : '0'
            }, 400);
        }
    }
});