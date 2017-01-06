var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString ? req.params.queryString : "";
    var fulltext = req.params.fulltext ? req.params.fulltext : "";
    var branch = req.params.branch ? req.params.branch : 'master';
    var count = req.params.count ? req.params.count : 25;
    var sort = req.params.sort;

    var repo = connect(repoId, branch);

    var queryStart = new Date().getTime();

    try {
        var result = repo.query({
            query: query ? query : createFulltextQuery(fulltext),
            count: count,
            sort: sort
        });
    } catch (err) {
        return returnError("Query failed: " + err);
    }

    var queryEnd = new Date().getTime() - queryStart;
    var queryResult = createQueryResult(result, queryEnd, repo);

    return {
        contentType: 'application/json',
        body: {
            queryResult: queryResult
        }
    }
};

function createFulltextQuery(value) {
    return "fulltext('_allText', '" + value + "', 'AND') OR ngram('_allText', '" + value + "', 'AND')";
}

function createQueryResult(result, queryEnd, repo) {
    var queryResult = {
        total: result.total,
        count: result.count,
        queryTime: queryEnd
    };

    var fetchStart = new Date().getTime();
    var entries = mapQueryHits(result, repo);

    var fetchEnd = new Date().getTime() - fetchStart;

    queryResult.hits = entries;
    queryResult.fetchTime = fetchEnd;
    return queryResult;
}

function mapQueryHits(result, repo) {
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
    return entries;
}

var connect = function (repoId, branch) {

    return nodeLib.connect({
        branch: branch,
        repoId: repoId
    });
};

var returnError = function (message) {
    return {
        contentType: 'application/json',
        body: {
            error: message
        }
    }
};