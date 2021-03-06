var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');
var ioLib = require('/lib/xp/io');


exports.get = function (req) {

    var repoId = req.params.repoId;
    if (!repoId) {
        return renderError("Missing parameter repoId");
    }

    var repo = repoLib.get(repoId);
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

    var errors = [];
    errors.push(message);

    return {
        contentType: 'application/json',
        body: {
            errors: errors
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


