$(function () {

    $(QUERY_INPUT).textcomplete([
        { // tech companies
            id: 'tech-companies',
            words: ['apple', 'google', 'facebook', 'github'],
            match: /\b(\w{1,})$/,
            search: function (term, callback) {
                getSuggestorValues(term, callback);
            },
            index: 1,
            replace: function (word) {
                return word + ' ';
            }
        }
    ], {
        onKeydown: function (e, commands) {
            if (e.ctrlKey && e.keyCode === 74) { // CTRL-J
                return commands.KEY_ENTER;
            }
        }
    });
    
});

function getSuggestorValues(term, callback) {

    var data = {
        value: term
    };

    jQuery.ajax({
        url: autocompleteServiceUrl,
        cache: true,
        type: 'GET',
        data: data,
        success: function (result) {
            console.log("Result", result);
            callback(result.suggester.suggestions);
            //updateQueryInput(result, queryInput);
        }
    });

}
