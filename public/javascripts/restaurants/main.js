$(function () {
    $('#search-restaurants').submit(submitter);
    $('#nav-button').click(navToggle);
    $('tr:not(.head)').click((e) => {
        // let restName = e.currentTarget.getElementsByClassName('restaurant-name')[0].innerText;
        // console.log(restName.split(' ').join('-').toLowerCase());
        window.location.href += e.currentTarget.id;
        // console.dir(e.currentTarget.id);
    });

    function submitter(e) {
        e.preventDefault();
        window.location.href = '/restaurants/' + e.target[0].value;
        /*postData(`/restaurants`, {answer: e.target[0].value})
            .then(data => addRestaurants(data))
            .catch(error => console.error(error));*/
    }

    function addRestaurants(restaurants) {
        $('.restaurants tr').not('tr.head').remove();
        if(restaurants.dane.length > 0) {
            restaurants.dane.forEach(item => {
                console.log(item);
                let row = document.createElement(`tr`);
                row.setAttribute('id', `${item.Id_Restaruacja}`);
                $(row).html(`<td class="rest-image">
                            <div class="img"></div>
                        </td>
                        <td class="rest-name">
                            <p class="restaurant-name">${item.Nazwa}</p>
                        </td>
                        <td class="price-tag">
                            <div class="price">
                                <span><i class="fas fa-money-bill-wave"></i></span>
                                <p>Średnia</p>
                            </div>
                        </td>
                        <td class="rest-rating">
                            <div class="ratings">
                                <div class="empty-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="full-stars" style="width: ${getPercent(item.Srednia_Ocen)}%">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                            </div>
                        </td>`);
                $('.restaurants tbody').append($(row));
            });
        } else {
            $('#restaurant-list').html(`<h1>Nie znaleziono restauracji.</h1>`);
        }
    }

    function getPercent(num) {
        return (num / 5) * 100;
    }

    function postData(url = ``, data = {}) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json());
    }

    function navToggle() {
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

    }
});