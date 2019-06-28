let submitter = () => {
    $('form.search').submit(function(e) {
        e.preventDefault();
        window.location.href = '/restaurants/' + e.target[0].value;
    });
}

$(function () {
    submitter();
    checkIfLogin();

    /*$('#login a').on('click', () => {
        $('.log-buttons .btn-log h2').click();
    });

    $('#join a').on('click', () => {
        $('.log-buttons .btn-reg h2').click();
    });*/

    $('.log-register-forms').css('width', '200%');

    $('.container').each((idx, el) => {
        $(el).css({
            width: '50%',
            marginLeft: (idx * 50) + '%'
        });
    });

    $('.log-buttons .btn-log h2').click(function () {
        slideLog($(this));
        /*let string = window.location.href;
        string = string.replace('#join', '#login');
        window.location.href = string;*/
    });
    $('.log-buttons .btn-reg h2').click(function () {
        slideLog($(this));
        /*let string = window.location.href;
        string = string.replace('#login', '#join');
        window.location.href = string;*/
    });
});

function checkIfLogin() {
    if(window.location.href.includes('#login')) {
        $('.log-buttons .btn-log h2').click();
    } else {
        $('.log-buttons .btn-reg h2').click();
    }
}

function slideLog(selected) {
    let direction;
    if(!selected.hasClass('selected')) {
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

export {submitter};