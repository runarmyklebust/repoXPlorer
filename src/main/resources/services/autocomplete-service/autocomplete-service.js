var autocompleter = require('/lib/autocompleter');

exports.get = function (req) {

    var term = req.params.term;
    var fullValue = req.params.fullValue;

    log.info("FullValue: [" + fullValue + "]");

    var result = autocompleter.execute(term, fullValue);
    
    return {
        contentType: 'application/json',
        body: {
            suggester: result
        }
    }
};
