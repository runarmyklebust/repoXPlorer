var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');

exports.post = function (req) {

    var branchId = req.params.branchId;
    var repoId = req.params.repoId;
    var nodeId = req.params.nodeId;

    log.info("Deleting node: [" + nodeId + "]");

    if (!branchId) {
        return renderError("no branchId given");
    }

    if (!repoId) {
        return renderError("no repoId given");
    }

    if (!nodeId) {
        return renderError("no nodeId given");
    }

    var myRepo = nodeLib.connect({
        repoId: repoId,
        branch: branchId,
        principals: ["role:system.admin"]
    });

    var deleted = myRepo.delete(nodeId);

    log.info("Deleted: %s", JSON.stringify(deleted));

    return returnMessage("Node with id: [" + nodeId + "] deleted");
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

