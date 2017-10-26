var autocompleter = require('/lib/autocompleter');

exports.get = function (req) {

    var term = req.params.term;
    var fullValue = req.params.fullValue;

    return {
        contentType: 'application/json',
        body: {
            suggester: autocompleter.execute(term, fullValue)
        }
    }
};
