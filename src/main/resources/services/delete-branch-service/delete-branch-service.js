var repoLib = require('/lib/xp/repo');

exports.post = function (req) {

    var repoId = req.params.repoId;
    var branchId = req.params.branchId;

    if (!repoId) {
        return renderError("no repo-id given");
    }

    if (!branchId) {
        return renderError("no branch given");
    }

    if (branchId === "master" || repoId === "system-repo") {
        return renderError("Not allowed to delete branch [" + branchId + "] in repo [" + repoId + "]");
    }

    try {
        repoLib.deleteBranch({
            branchId: branchId,
            repoId: repoId
        });
    } catch (err) {
        renderError("Cannot delete branch: [" + branchId + "] in repo [" + repoId + "]: " + err);
    }

    repoLib.refresh();

    return returnMessage("Branch [" + branchId + "] deleted in repo [" + repoId + "]");
};

function createRepo(repoId) {
    return repoLib.create({
        id: repoId
    });
}

var returnMessage = function (message) {
    return {
        contentType: 'application/json',
        body: {
            message: message
        }
    }
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

