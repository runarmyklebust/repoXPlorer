var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');
var cacheLib = require('/lib/cache');

var multiRepoConnectionCache = cacheLib.newCache({
    size: 100,
    expire: 3600
});

var repoConnectionCache = cacheLib.newCache({
    size: 100,
    expire: 3600
});

exports.get = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    var query = req.params.queryString ? req.params.queryString : "";
    var fulltext = req.params.fulltext ? req.params.fulltext : "";
    var branch = req.params.branch ? req.params.branch : 'master';
    var count = req.params.count ? req.params.count : 25;
    var start = req.params.start ? req.params.start : 0;
    var sort = req.params.sort;

    var sources = [
        {
            repoId: repoId,
            branch: branch,
            principals: ["role:system.admin"]
        }];

    var repo = getMultiRepoConnection(sources);

    var queryStart = new Date().getTime();

    try {
        var result = repo.query({
            query: query ? query : createFulltextQuery(fulltext),
            count: count,
            start: start,
            sort: sort,
            explain: true
        });
    } catch (err) {
        return returnError("Query failed: " + err);
    }

    //log.info("REEEEESULT!!!!!: %s", JSON.stringify(result, null, 4));

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

            //log.info("HIT: %s", JSON.stringify(hit, null, 2));

            var node = getRepoConnection(hit.repoId, hit.branch).get(hit.id);

            if (!node) {
                var message = "Node found in search but not in storage: " + hit.id;
                log.error(message);
                errors.push(message);
            } else {
                var entry = {
                    _id: hit.id,
                    _score: hit.score,
                    _path: node._path,
                    explain: hit.explanation,
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

var getRepoConnection = function (repoId, branch) {
    return repoConnectionCache.get({repoId: repoId, branch: branch}, function () {
        return repoConnect(repoId, branch);
    });
};

var getMultiRepoConnection = function (sources) {
    return multiRepoConnectionCache.get(sources, function () {
        return multiRepoConnect(sources);
    });
};

var multiRepoConnect = function (sources) {

    return nodeLib.multiRepoConnect({
        sources: sources
    });
};

var repoConnect = function (repoId, branch) {
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