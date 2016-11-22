var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

exports.get = function (req) {

    var repoId = req.params.repoId;
    if (!repoId) {
        return renderError("Missing parameter repoId");
    }

    var repo = repoLib.get({
        id: repoId
    });
    if (!repo) {
        return renderError("Repo with id: [" + repoId + "] not found");
    }

    var repoInfo = {
        id: repoId
    };

    var branchInfo = [];

    repo.branches.forEach(function (branch) {
        branchInfo.push(getBranchInfo(repoId, branch));
    });

    repoInfo.branchInfo = branchInfo;

    return {
        contentType: 'application/json',
        body: {
            repoInfo: repoInfo
        }
    }
};


var getBranchInfo = function (repoId, branch) {

    var branchInfo = {
        branch: branch
    };

    var result = runInRepoContext(repoId, branch, function () {
        return nodeLib.query({
            count: 0
        });
    });

    branchInfo.total = result.total;
    return branchInfo;
};

var renderError = function (message) {
    return {
        contentType: 'application/json',
        body: {
            error: message
        }
    }
};

var runInRepoContext = function (repoId, branch, callback) {

    return contextLib.run({
        branch: branch,
        repository: repoId,
        user: {
            login: 'su',
            userStore: 'system'
        },
        principals: ["role:system.admin"]
    }, callback);

};


