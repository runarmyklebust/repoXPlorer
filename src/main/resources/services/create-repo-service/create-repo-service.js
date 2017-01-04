var repoLib = require('/lib/xp/repo');

exports.post = function (req) {

    var repoId = req.params.repoId;

    if (!repoId) {
        return returnError("no repo-id given");
    }

    try {
        var existingRepo = repoLib.get(repoId);
        if (existingRepo) {
            return returnError("repoId [" + repoId + "] already exists");
        }
    } catch (err) {
        return returnError("create repo with id [" + repoId + "] failed: " + err);
    }

    var createdRepo;

    try {
        createdRepo = createRepo(repoId);
    } catch (err) {
        return returnError("create repo with id [" + repoId + "] failed: " + err);
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

var returnError = function (message) {
    return {
        contentType: 'application/json',
        body: {
            error: message
        }
    }
};

