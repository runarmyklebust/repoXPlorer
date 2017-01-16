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
        contextLib.run({
            repository: repoId
        }, function () {
            var result = repoLib.createBranch({
                branchId: branchId
            });
            log.info('Branch [' + result.id + '] created');
        })
    }
    catch
        (e) {
        if (e.code == 'branchAlreadyExists') {
            renderError('Branch [features-branch] already exist');
        } else {
            renderError('Unexpected error: ' + e.message);
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

