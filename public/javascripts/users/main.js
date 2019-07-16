import {options} from '../searchEngine.js';

$(function() {
    $.typeahead(options);
    // console.log(new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '));
    $('.restaurant .details').click(function() {
        window.location.href = '/restaurants/details/' + $(this).parent().attr('id');
    });
    $('.restaurant .favourite').click(function () {
        let data = {};
        data['user'] = $('#profile .profile-name').text();
        data['restaurant'] = $(this).parent().attr('id');
        fetch(window.location.href, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        }).then(response => response.status)
            .then(data => {
                if(data === 200) {
                    $('#' + $(this).parent().attr('id')).hide();
                } else if(data === 500){
                    alert('Nie udało się usunąć restauracji. Spróbuj ponownie.');
                } else {
                    window.location.href = '/#login';
                }
            });
    });
});