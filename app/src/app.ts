/// <reference path="../../typings/index.d.ts" />

$(document).ready(() => {
    $('input.autocomplete').autocomplete({
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'http://placehold.it/250x250'
        }
    });
});