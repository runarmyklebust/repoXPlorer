var repoLib = require('/lib/xp/repo');

exports.post = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return renderError("no repo-id given");
    }

    if (repoId === "cms-repo" || repoId === "system-repo") {
        return renderError("Not allowed to delete repository [" + repoId + "]");
    }

    var existingRepo = repoLib.get(repoId);

    if (!existingRepo) {
        return renderError("repoId [" + repoId + "] does not exists");
    }

    repoLib.delete(repoId);

    repoLib.refresh();

    return returnMessage("Repository [" + repoId + "] deleted");
};

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

