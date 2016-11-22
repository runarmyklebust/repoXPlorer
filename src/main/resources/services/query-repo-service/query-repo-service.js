var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString;


    log.info("Running query: [" + query + "]");

    var result = runInRepo(repoId, 'master', function () {
        return nodeLib.query({
            query: query
        });
    });

    log.info("result: %s", JSON.stringify(result));

    return {
        contentType: 'application/json',
        body: {
            result: result
        }
    }
};

var runInRepo = function (repoId, branch, callback) {

    return contextLib.run({
        branch: branch,
        repository: repoId
    }, callback);


};

