var options = {
    input: '.js-typeahead',
    order: 'desc',
    limit: 10,
    hint: true,
    minLength: 1,
    offset: true,
    dynamic: true,
    delay: 500,
    display: ['street', 'city'],
    templateValue: '{{street}}, {{city}}',
    source: {
        ajax: {
            type: 'POST',
            url: 'http://localhost:3000/restaurants/a/suggestion',
            data: {
                phrase: "{{query}}"
            }
        }
    },
    callback: {
        onSubmit: (node, form, item, event) => {
            event.preventDefault();
            let searchString = event.target[0].value.split(/\s*,?\s+/).join('-');
            window.location.href = '/restaurants/' + searchString;
        }
    }
}

export {options};