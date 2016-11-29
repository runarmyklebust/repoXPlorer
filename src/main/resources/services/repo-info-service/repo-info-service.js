var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');

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

    var result = connect(repoId, branch).query({
        count: 0
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

var connect = function (repoId, branch) {

    return nodeLib.connect({
        branch: branch,
        repoId: repoId,
        user: {
            login: 'su',
            userStore: 'system'
        },
        principals: ["role:system.admin"]
    });
};


