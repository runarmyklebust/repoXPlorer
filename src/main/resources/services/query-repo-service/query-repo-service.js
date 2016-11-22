var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString;

    var result = runInRepo(repoId, 'master', function () {
        return nodeLib.query({
            query: query
        });
    });

    var queryResult = {
        total: result.total,
        count: result.count
    };

    var entries = [];

    result.hits.forEach(function (hit) {
        var node = runInRepo(repoId, 'master', function () {
            return nodeLib.get({
                key: hit.id
            })
        });

        var entry = {
            id: hit.id,
            _score: hit.score,
            _path: node._path,
            node: node
        };

        entries.push(entry);
    });

    queryResult.hits = entries;

    log.info("result: %s", JSON.stringify(result));

    return {
        contentType: 'application/json',
        body: {
            result: queryResult
        }
    }
};

var runInRepo = function (repoId, branch, callback) {

    return contextLib.run({
        branch: branch,
        repository: repoId
    }, callback);


};

