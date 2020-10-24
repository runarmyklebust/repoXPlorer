var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString ? req.params.queryString : "";
    var fulltext = req.params.fulltext ? req.params.fulltext : "";
    var filter = req.params.filter ? req.params.filter : "";
    var branch = req.params.branch ? req.params.branch : 'master';
    var count = req.params.count ? req.params.count : 25;
    var start = req.params.start ? req.params.start : 0;
    var sort = req.params.sort;

    var repo = connect(repoId, branch);

    var queryStart = new Date().getTime();

    try {
        var result = repo.query({
            query: query ? query : createFulltextQuery(fulltext),
            filters: filter ? JSON.parse(filter) : null,
            count: count,
            start: start,
            sort: sort
        });
    } catch (err) {
        return returnError("Query failed: " + err);
    }

    var queryEnd = new Date().getTime() - queryStart;
    var queryResult = createQueryResult(result, queryEnd, repo, start);

    return {
        contentType: 'application/json',
        body: {
            queryResult: queryResult,
            errors: queryResult.errors
        }
    }
};

function createFulltextQuery(value) {
    return "fulltext('_allText', '" + value + "', 'AND') OR ngram('_allText', '" + value + "', 'AND')";
}

function createQueryResult(result, queryEnd, repo, start) {
    var queryResult = {
        start: start,
        total: result.total,
        count: result.count,
        queryTime: queryEnd
    };

    var fetchStart = new Date().getTime();
    var mappingResult = mapQueryHits(result, repo);

    var fetchEnd = new Date().getTime() - fetchStart;

    queryResult.hits = mappingResult.entries;
    queryResult.fetchTime = fetchEnd;
    queryResult.errors = mappingResult.errors;
    return queryResult;
}

function mapQueryHits(result, repo) {
    var entries = [];
    var errors = [];
    result.hits.forEach(function (hit) {
        var node = repo.get(hit.id);

        if (!node) {
            var message = "Node found in search but not in storage: " + hit.id;
            log.error(message);
            errors.push(message);
        } else {
            var entry = {
                _id: hit.id,
                _score: hit.score,
                _path: node._path,
                node: node
            };

            entries.push(entry);
        }

        }
    );

    return {
        entries: entries,
        errors: errors
    };
}

var connect = function (repoId, branch) {
    return nodeLib.connect({
        branch: branch,
        repoId: repoId
    });
};

var returnError = function (message) {

    var errors = [];
    errors.push(message);

    return {
        contentType: 'application/json',
        body: {
            errors: errors
        }
    }
};
