export default function addRestaurants(restaurants) {
    $('.restaurants tr').not('tr.head').remove();
    if(restaurants.dane.length > 0) {
        $('.restaurant-list h1').remove();
        $('.restaurants').show();
        restaurants.dane.forEach(item => {
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
        $('.restaurants').hide();
        if($('.restaurant-list h1').length === 0) {
            $('.restaurant-list').append(`<h1>Nie znaleziono restauracji.</h1>`);
        }
    }
}

function getPercent(num) {
    return (num / 5) * 100;
}