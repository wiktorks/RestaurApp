$(function () {
    $('#search-restaurants').submit(submitter);
    $('#nav-button').click(navToggle);

    function submitter(e) {
        e.preventDefault();
        postData(`/restaurants`, {answer: e.target[0].value})
            .then(data => addRestaurants(data))
            .catch(error => console.error(error));
    }

    function addRestaurants(restaurants) {
        $('.restaurants tr').not('tr.head').remove();
        restaurants.dane.forEach(item => {
            console.log(item);
            let row = document.createElement('tr');
            $(row).html(`<td>
                            <div class="img"></div>
                        </td>
                        <td>
                            <p class="restaurant-name">${item.Nazwa}</p>
                        </td>
                        <td>
                            <div class="price">
                                <span><i class="fas fa-money-bill-wave"></i></span>
                                <p>Średnia</p>
                            </div>
                        </td>
                        <td>
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