var repoLib = require('/lib/xp/repo');
var contextLib = require('/lib/xp/context');

exports.post = function (req) {

    log.info("Creating branch!!");

    var branchId = req.params.branchId;
    var repoId = req.params.repoId;

    if (!branchId) {
        return renderError("no branchId given");
    }

    if (!repoId) {
        return renderError("no repoId given");
    }

    var existingRepo = repoLib.get(repoId);

    if (!existingRepo) {
        return renderError("repoId [" + repoId + "] not found");
    }

    try {
        var result = repoLib.createBranch({
            repoId: repoId,
            branchId: branchId
        });
        log.info('Branch [' + result.id + '] created');
    }
    catch (e) {
        log.info("Render error: " + e);

        if (e.code == 'branchAlreadyExists') {
            return renderError('Branch [features-branch] already exist');
        } else {
            log.info("Render unexpected: " + e);
            return renderError('Error: ' + e);
        }
    }

    return returnMessage("Branch [" + branchId + "] created");
};

var returnMessage = function (message) {
    return {
        contentType: 'application/json',
        body: {
            message: message
        }
    }
};

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

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

