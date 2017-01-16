var repoLib = require('/lib/xp/repo');

exports.post = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return renderError("no repo-id given");
    }

    try {
        var existingRepo = repoLib.get(repoId);
        if (existingRepo) {
            return renderError("repoId [" + repoId + "] already exists");
        }
    } catch (err) {
        return renderError("create repo with id [" + repoId + "] failed: " + err);
    }

    var createdRepo;

    try {
        createdRepo = createRepo(repoId);
    } catch (err) {
        return renderError("create repo with id [" + repoId + "] failed: " + err);
    }

    return returnMessage("Repository [" + createdRepo.id + "] created");
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

