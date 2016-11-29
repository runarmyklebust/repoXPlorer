var autocompleter = require('/lib/autocompleter');

exports.get = function (req) {

    var currentValue = req.params.value;

    var result = autocompleter.execute(currentValue);

    return {
        contentType: 'application/json',
        body: {
            suggester: result
        }
    }
};
