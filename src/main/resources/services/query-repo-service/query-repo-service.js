var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString ? req.params.queryString : "";
    var branch = req.params.branch ? req.params.branch : 'master';
    var count = req.params.count ? req.params.count : 25;
    var sort = req.params.sort;

    var repo = connect(repoId, branch);

    var queryStart = new Date().getTime();
    var result = repo.query({
        query: query,
        count: count,
        sort: sort
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
        var node = repo.get(hit.id);

            var entry = {
                id: hit.id,
                _score: hit.score,
                _path: node._path,
                node: node
            };

            entries.push(entry);
        }
    );

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

var connect = function (repoId, branch) {

    return nodeLib.connect({
        branch: branch,
        repoId: repoId
    });
};

