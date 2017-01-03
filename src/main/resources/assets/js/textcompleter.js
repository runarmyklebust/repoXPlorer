$(function () {

    $(QUERY_INPUT).textcomplete([
        {
            match: /\b(\w+|"|'\)|"\)|')$/,
            search: function (term, callback) {
                getSuggestorValues(term, callback);
            },
            index: 1,
            replace: function (word) {
                return word + '';
            }
        }
    ]);

});

function getSuggestorValues(term, callback) {

    var queryInput = $(QUERY_INPUT);

    var data = {
        term: term,
        fullValue: queryInput.val()
    };

    jQuery.ajax({
        url: autocompleteServiceUrl,
        cache: true,
        type: 'GET',
        data: data,
        success: function (result) {
            callback(result.suggester.suggestions);
            updateQueryInput(result, $(QUERY_INPUT));
        }
    });
}

var updateQueryInput = function (result, element) {
    if (!result.suggester.valid) {
        element.css('color', 'red');
    } else {
        element.css('color', 'green');
    }
};
