import {options} from '../searchEngine.js';

$(function() {
    $.typeahead(options);
    console.log(new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '));
});