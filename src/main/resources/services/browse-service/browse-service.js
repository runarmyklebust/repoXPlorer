var nodeLib = require('/lib/xp/node');

exports.get = function (req) {

    var path = "/";

    var repoId = req.params.repoId;
    var branch = 'master';

    if (req.params.branch) {
        branch = req.params.branch;
    }

    if (req.params.parent) {
        path = req.params.parent;
    }

    var repo = nodeLib.connect({
        repoId: repoId,
        branch: branch
    });

    var result = repo.findChildren({
        start: 0,
        count: 2,
        parentKey: path
    });

    var model = createModel(result, repo);

    log.info("Model: %s", JSON.stringify(model, null, 4));

    return {
        contentType: 'application/json',
        body: {
            tree: model
        }
    }
};

var createModel = function (result, repo) {

    var model = {
        total: result.total,
        count: result.count
    };

    var data = [];

    result.hits.forEach(function (hit) {

        var node = getNode(hit.id, repo);

        var children = repo.findChildren({
            start: 0,
            count: 0,
            parentKey: hit.id
        });


        log.info("Found node: %s", node);
        var entry = {
            path: node._path,
            children: children.total > 0
        };
        data.push(entry);
    });

    model.data = data;

    return model;
};

var getNode = function (id, repo) {
    return repo.get(id);
};