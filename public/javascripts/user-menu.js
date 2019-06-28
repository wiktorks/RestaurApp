export default function userMenu() {
    let userName = $('#user-name').text();
    $('#profile').on('click', function (e) {
        e.stopPropagation();
        $('#profile ul').toggleClass('hidden');
    });
    $('body').on('click', function () {
        $('#profile ul').addClass('hidden');
    });
    $('#profile li:first-child').on('click', function (e) {
        e.stopPropagation();
        window.location.href = '/users/' + userName + '/favourites';
    });
    $('#profile li:nth-child(2)').on('click', function (e) {
        e.stopPropagation();
        window.location.href = '/users/' + userName + '/settings';
    })
    $('#profile li:last-child').on('click', function (e) {
        e.stopPropagation();
        window.location.href = '/logout';
    });
}