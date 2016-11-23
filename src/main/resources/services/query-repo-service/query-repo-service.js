var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString;

    var queryStart = new Date().getTime();
    var result = runInRepo(repoId, 'master', function () {
        return nodeLib.query({
            query: query
        });
    });
    var queryEnd = new Date().getTime() - queryStart;

    var queryResult = {
        total: result.total,
        count: result.count,
        queryTime: queryEnd
    };

    var fetchStart = new Date().getTime();
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
    var fetchEnd = new Date().getTime() - fetchStart;

    queryResult.hits = entries;
    queryResult.fetchTime = fetchEnd;

    log.info("result: %s", JSON.stringify(result));

    return {
        contentType: 'application/json',
        body: {
            queryResult: queryResult
        }
    }
};

var runInRepo = function (repoId, branch, callback) {

    return contextLib.run({
        branch: branch,
        repository: repoId
    }, callback);


};

