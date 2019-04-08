var DELETE_CONFIRM_MESSAGE = "#deleteConfirmMessage";

var QUERY_PANEL = '#queryPanel';
var BROWSE_PANEL = '#browsePanel';
var DIFF_PANEL = '#diffPanel';
var INTEGRITY_PANEL = '#integrityPanel';
var panels = [QUERY_PANEL, BROWSE_PANEL, DIFF_PANEL, INTEGRITY_PANEL];

var EVENT_REPO_CONNECTED = "repoXPlorer:repo:connected";
var EVENT_REPO_DISCONNECTED = "repoXPlorer:repo:disconnected";

var model = {
    buttons: {},
    selectors: {},
    inputs: {},
    modals: {},
    parts: {},
    input: {},
    links: {}
};

$(function () {

    initializeModel();

    initializeView();

    initComponentEventHandlers();

    initDeleteModalDialog();
    initCreateBranchModalDialog();
    initCreateRepoModalDialog();

    getRepoList(model.selectors.repo);

    model.selectors.repo.change(function () {
        model.selectors.repo.trigger(EVENT_REPO_DISCONNECTED);
        setChangeRepoLayout();
        getRepoInfo(this.value, model.selectors.branch);
    });

    model.selectors.branch.change(function () {
        model.selectors.branch.trigger(EVENT_REPO_CONNECTED);
    });

    model.buttons.createRepo.click(function () {
        createRepo();
    });

    model.buttons.createBranch.click(function () {
        createBranch();
    });

    model.buttons.query.click(function () {
        doQuery();
    });

    initQueryModeListener();

    initTextComplete();

    //activateNavbar();
});

function initializeModel() {

    model.buttons.query = $('#queryButton');
    model.buttons.createRepo = $('#createRepoButton');
    model.buttons.createBranch = $('#createBranchButton');
    model.buttons.deleteRepo = $('#deleteRepoButton');
    model.buttons.deleteBranch = $('#deleteBranchButton');
    model.buttons.deleteRepoConfirm = $('#deleteRepoConfirmButton');
    model.buttons.deleteBranchConfirm = $('#deleteBranchConfirmButton');
    model.buttons.deleteRepoConfirmCancel = $('#deleteRepoConfirmCancelButton');
    model.buttons.deleteBranchConfirmCancel = $('#deleteBranchConfirmCancelButton');

    model.inputs.createRepo = $('#createRepoId');
    model.inputs.createBranch = $('#createBranchInput');
    model.inputs.fulltext = $('#fulltextSearch');
    model.inputs.query = $('#queryInput');
    model.inputs.filter = $('#filterInput');
    model.inputs.count = $('#queryCountInput');
    model.inputs.start = $('#queryStart');
    model.inputs.order = $('#querySortInput');
    model.inputs.explain = $('#explainInput');

    model.selectors.repo = $('#selectRepoId');
    model.selectors.branch = $('#selectBranchId');
    model.selectors.deleteRepo = $('#deleteRepoSelector');
    model.selectors.deleteBranch = $('#deleteBranchSelector');
    model.selectors.deleteBranchRepo = $('#deleteBranchRepoSelector');
    model.selectors.createBranch = $('#createBranchSelector');

    model.links.deleteRepo = $('#deleteRepoModalOpen');
    model.links.deleteBranch = $('#deleteBranchModalOpen');
    model.links.createBranch = $('#createBranchModalOpen');
    model.links.createRepo = $('#createRepoModalOpen');

    model.modals.deleteRepo = $('#deleteRepoModal');
    model.modals.deleteBranch = $('#deleteBranchModal');
    model.modals.createBranch = $('#createBranchModal');
    model.modals.createRepo = $('#createRepoModal');

    model.parts.deleteRepoConfirm = $('#deleteRepoConfirm');
    model.parts.deleteBranchConfirm = $('#deleteBranchConfirm');
    model.parts.queryResult = $('#queryResultBox');
    model.parts.messageBox = $('#messageBox');
}

function initComponentEventHandlers() {

    $(document).on(EVENT_REPO_CONNECTED, function () {
        enableElement(model.inputs.fulltext);
        enabledButton(model.buttons.query);
        doQuery();
    });

    $(document).on(EVENT_REPO_DISCONNECTED, function () {
        disableElement(model.inputs.fulltext);
        disableButton(model.buttons.query);
    });
}

function initQueryModeListener() {
    model.inputs.fulltext.keyup(function () {
        delay(function () {
            toggleFulltextMode();
        }, 10);
    });

    model.inputs.query.keyup(function () {
        delay(function () {
            toggleQueryMode();
        }, 10);
    });
}

function toggleQueryMode() {
    if (model.inputs.query.val()) {
        disableElement(model.inputs.fulltext);
    } else {
        enableElement(model.inputs.fulltext);
    }
}

function toggleFulltextMode() {
    if (model.inputs.fulltext.val()) {
        disableElement(model.inputs.query);
        doQuery();
    } else {
        enableElement(model.inputs.query);
        model.parts.queryResult.hide();
    }
}

function initDeleteModalDialog() {

    model.parts.deleteRepoConfirm.hide();
    model.parts.deleteBranchConfirm.hide();

    model.modals.deleteRepo.on('shown.bs.modal', function () {
        enableElement(model.selectors.deleteRepo);
        model.parts.deleteRepoConfirm.hide();
        disableButton(model.buttons.deleteRepo);
        getRepoList(model.selectors.deleteRepo);
        model.selectors.deleteRepo.focus();
    });

    model.modals.deleteBranch.on('shown.bs.modal', function () {
        enableElement(model.selectors.deleteBranchRepo);
        model.selectors.deleteBranch.val(null);
        model.parts.deleteBranchConfirm.hide();
        disableButton(model.buttons.deleteBranch);
        getRepoList(model.selectors.deleteBranchRepo);
        model.selectors.deleteBranchRepo.focus();
    });

    model.selectors.deleteRepo.change(function () {
        enabledButton(model.buttons.deleteRepo);
    });

    model.selectors.deleteBranchRepo.change(function () {
        enableElement(model.selectors.deleteBranch);
        getRepoInfo(this.value, model.selectors.deleteBranch);
    });

    model.selectors.deleteBranch.change(function () {
        enabledButton(model.buttons.deleteBranch);
    });

    model.buttons.deleteRepo.click(function () {
        var selectedRepo = model.selectors.deleteRepo.val();
        var data = {
            repoId: selectedRepo
        };
        jQuery.ajax({
            url: repoInfoService,
            cache: false,
            type: 'GET',
            data: data,
            success: function (result) {
                renderDeleteConfirmMessage($(DELETE_CONFIRM_MESSAGE), result);
                model.parts.deleteRepoConfirm.show();
                disableButton(model.buttons.deleteRepo);
                disableElement(model.selectors.deleteRepo);
                setStartLayout();
            }
        });
    });

    model.buttons.deleteBranch.click(function () {

        console.log("Clicking delete branch");

        var selectedRepo = model.selectors.deleteBranchRepo.val();
        var data = {
            repoId: selectedRepo
        };
        jQuery.ajax({
            url: repoInfoService,
            cache: false,
            type: 'GET',
            data: data,
            success: function (result) {
                model.parts.deleteBranchConfirm.show();
                disableButton(model.buttons.deleteBranch);
                disableElement(model.selectors.deleteBranch);
                setStartLayout();
            }
        });
    });


    model.buttons.deleteRepoConfirm.click(function () {
        deleteRepo();
        model.parts.deleteRepoConfirm.hide();
    });

    model.buttons.deleteBranchConfirm.click(function () {
        deleteBranch();
        model.parts.deleteBranchConfirm.hide();
    });

    model.buttons.deleteRepoConfirmCancel.click(function () {
        model.parts.deleteRepoConfirm.hide();
        disableButton(model.buttons.deleteRepo);
        getRepoList(model.selectors.deleteRepo);
        enableElement(model.selectors.deleteRepo);
    });
}

function initCreateBranchModalDialog() {

    model.modals.createBranch.on('shown.bs.modal', function () {
        getRepoList(model.selectors.createBranch);
        model.selectors.createBranch.focus();
    });
}

function initCreateRepoModalDialog() {

    model.modals.createRepo.on('shown.bs.modal', function () {
        model.inputs.createRepo.focus();
    })
}

function renderDeleteConfirmMessage(element, result) {

    var repoInfo = result.repoInfo;
    var branchInfo = repoInfo.branchInfo;

    var html = "<h3>" + result.repoInfo.id + "</h3>";
    html += "<p>Branches:</p>";
    html += "<ul>";
    branchInfo.forEach(function (branch) {
        html += '<li>' + branch.branch + ' (' + branch.total + ' nodes)</li>';
    });
    html += "</ul>";

    element.html(html);
}

var initializeView = function () {
    model.parts.messageBox.hide();
    setStartLayout();
};

var setStartLayout = function () {
    $(QUERY_PANEL).show();
    $(BROWSE_PANEL).hide();
    $(DIFF_PANEL).hide();
    model.parts.queryResult.hide();
    model.selectors.branch.val(null);
    model.selectors.repo.val(null);
    disableElement(model.inputs.fulltext);
    disableButton(model.buttons.query);
};

function disableElement(element) {
    element.attr("disabled", "disabled");
}

function enableElement(element) {
    element.attr("disabled", false);
}

var setChangeRepoLayout = function () {
    model.parts.queryResult.hide();
};

var disableButton = function (element) {
    element.prop("disabled", true);
};

var enabledButton = function (element) {
    element.prop("disabled", false);
};


var getRepoList = function (renderer) {
    jQuery.ajax({
        url: repoLoaderService,
        cache: false,
        type: 'GET',
        success: function (result) {
            renderRepoList(result, renderer);
        }
    });
};

var getRepoInfo = function (id, branchSelector) {
    var data = {
        repoId: id
    };

    jQuery.ajax({
        url: repoInfoService,
        cache: false,
        type: 'GET',
        data: data,
        success: function (result) {
            renderBranchList(result, branchSelector);
        }
    });
};

function createRepo() {
    var repoIdInput = model.inputs.createRepo;
    var repoId = repoIdInput.val();

    var data = {
        repoId: repoId
    };

    jQuery.ajax({
        url: createRepoServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            getRepoList(model.selectors.repo);
            repoIdInput.val('');
            model.modals.createRepo.modal('hide');
            renderMessage(result);
            setStartLayout();
        }
    });
}


function createBranch() {
    var repoIdInput = model.selectors.createBranch;
    var repoId = repoIdInput.val();
    var branchId = model.inputs.createBranch.val();

    var data = {
        repoId: repoId,
        branchId: branchId
    };

    jQuery.ajax({
        url: createBranchServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            model.modals.createBranch.modal('hide');
            renderMessage(result);
            setStartLayout();
        }
    });
}

function deleteRepo() {
    var repoId = model.selectors.deleteRepo.find(":selected").text();

    var data = {
        repoId: repoId
    };

    jQuery.ajax({
        url: deleteRepoServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            model.modals.deleteRepo.modal('hide');
            renderMessage(result);
        }
    });
}


function deleteBranch() {
    var repoId = model.selectors.deleteBranchRepo.find(":selected").text();
    var branchId = model.selectors.deleteBranch.val();

    var data = {
        repoId: repoId,
        branchId: branchId
    };

    jQuery.ajax({
        url: deleteBranchServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            model.modals.deleteBranch.modal('hide');
            renderMessage(result);
        }
    });

}

function doQuery() {

    var queryString = model.inputs.query.val();
    var fulltext = model.inputs.fulltext.val();
    var repoId = model.selectors.repo.find(":selected").text();
    var branch = model.selectors.branch.val();
    var count = model.inputs.count.val();
    var start = model.inputs.start.val();
    var sort = model.inputs.order.val();
    var explain = model.inputs.explain.is(':checked');
    var filter = model.inputs.filter.val();

    var data = {
        repoId: repoId,
        queryString: queryString,
        fulltext: fulltext,
        branch: branch,
        count: count,
        start: start,
        sort: sort,
        explain: explain,
        filter: filter
    };

    jQuery.ajax({
        url: queryRepoServiceUrl,
        cache: false,
        data: data,
        type: 'GET',
        success: function (result) {
            renderQueryResult(result, model.parts.queryResult);
        }
    });
}

// RENDER STUFF

var renderRepoList = function (result, renderer) {

    var html = "";
    html += '<option value="" disabled selected>Select repository</option>';
    result.repoList.forEach(function (entry) {
        html += "<option value='" + entry.id + "'>" + entry.id + "</option>";
    });

    renderer.html(html);
};

var renderBranchList = function (result, renderer) {

    var repoInfo = result.repoInfo;
    var branchInfo = repoInfo.branchInfo;

    var html = "";
    if (branchInfo.length == 1) {
        html = renderSingleBranch(html, branchInfo);
        renderer.trigger(EVENT_REPO_CONNECTED);
    } else {
        html = renderMultipleBranches(html, branchInfo);
    }

    renderer.html(html);
};

var renderSingleBranch = function (html, branchInfo) {
    html += '<option value=';
    html += '"' + branchInfo[0].branch + '"';
    html += 'selected>';
    html += branchInfo[0].branch;
    html += ' (' + branchInfo[0].total + ' nodes)';
    html += '</option>';

    return html;
};

var renderMultipleBranches = function (html, branchInfo) {
    html += '<option value="" disabled selected>Select branch</option>';
    branchInfo.forEach(function (branch) {
        html += '<option value=';
        html += '"' + branch.branch + '"';
        html += '>' + branch.branch + ' (' + branch.total + ' nodes )</option>';
    });
    return html;
};

var renderQueryResult = function (result, renderer) {

    renderMessage(result);

    var queryResult = result.queryResult;

    var html = "";
    html += renderQueryMetaData(queryResult);
    html += renderQueryHits(queryResult);

    renderer.html(html);

    Prism.highlightAll();
    renderer.show();
};

function renderQueryMetaData(queryResult) {

    var start = Number(queryResult.start);
    var count = Number(queryResult.count);
    var to = start + count;
    var from = start + 1;

    var html = "";
    html += '<div class="queryResultMeta">';
    html += "<p>QueryTime: " + queryResult.queryTime + "ms, FetchTime: " + queryResult.fetchTime + "ms</p>";
    html += "<p>Showing hits: " + from + "->" + to + " of " + queryResult.total + "</p>";
    html += "</div>";
    return html;
}

var renderQueryHits = function (result) {

    var html = '';
    html += '<ul class="queryResult">';
    var i = 0;
    result.hits.forEach(function (hit) {
        html += renderQueryHit(hit, i++);
    });
    html += "</ul>";
    return html;
};

var renderQueryHit = function (hit, itemNum) {

    var collapseId = "collapse-" + itemNum;
    var headerId = "header-" + itemNum;

    var html = '';
    html += '<li class="resultHit" hit="' + headerId + '" >';
    html += renderHitHeader(hit, collapseId);
    html += renderHitBody(hit, collapseId);
    html += '</li>';

    return html;
};

var renderHitHeader = function (hit, collapseId) {

    var html = "";
    html +=
        '  <a class="hitHeader btn" href="#' + collapseId + '" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="' +
        collapseId + '">';
    html += '   <p>' + hit._path + "</p>";
    html += '   <p class="score">[score: ' + parseFloat(hit._score).toFixed(2) + "]</p>";
    html += '  </a>';
    return html;
};

var renderHitBody = function (hit, collapseId) {

    var html = '';
    html += '<div class="resultBody collapse" id="' + collapseId + '">';
    html += renderHitWrapper(collapseId);
    html += "<div class=\"tab-content\" id=\"nav-tabContent\">";
    html += renderHitDataElement(createNodeDataModel(hit.node), "data", collapseId, true);
    html += renderHitDataElement(hit.explanation, "explain", collapseId, false);
    html += "</div>";
    html += '</div>';
    return html
};

var createNodeDataModel = function (node) {

    return {
        _name: node._name,
        type: node.type,
        displayName: node.displayName,
        data: node.data
    }
};

var renderHitWrapper = function (collapseId) {
    var html = "";
    html += '<ul class="nav nav-tabs" id="myTab" role="tablist">';
    html += '  <li class="nav-item">';
    html += '    <a class="nav-link active" aria-selected="true" role="tab" data-toggle="tab"' +
            ' id="nav-tab-data' + collapseId + '" ' +
            ' href="#data-' + collapseId + '" ' +
            ' aria-controls="data-' + collapseId + '">Data</a>';
    html += '  </li>';
    html += '  <li class="nav-item">';
    html += '    <a class="nav-link" aria-selected="false" role="tab" data-toggle="tab"' +
            ' id="nav-tab-explain' + collapseId + '" ' +
            ' href="#explain-' + collapseId + '" ' +
            ' aria-controls="explain-' + collapseId + '">Explain</a>';
    html += '  </li>';
    html += '</ul>';
    return html;
};

var renderHitDataElement = function (data, type, id, active) {

    var activeClass = active ? " show active " : "";
    var parentId = "nav-tab-" + type + id;
    var elementId = type + "-" + id;

    var html = "";
    html += '<div role="tabpanel" class="tab-pane fade' + activeClass + '" ' +
            ' aria-labelledby="' + parentId + '"' +
            ' id="' + elementId + '">';
    if (!data) {
        html += "<p>No data</p>"
    } else {
        html += '<pre>';
        html += ' <code class="language-javascript">';
        html += htmlEscape(JSON.stringify(data, null, 4));
        html += ' </code>';
        html += '</pre>';
    }
    html += '</div>';
    return html
};

var renderMessage = function (result) {

    var html = "";
    var timeOut = 2500;

    var errors = result.errors;
    if (errors && errors.length > 0) {
        timeOut = 5000;
        var maxErrors = 10;

        for (var i = 0; i < errors.length && i < maxErrors; i++) {
            html += '<p>' + errors[i] + '</p>';
        }

        if (errors.length > maxErrors) {
            var more = Number(errors.length) - Number(maxErrors);
            html += '<p>' + more + ' more errors...</p>';
        }

        model.parts.messageBox.removeClass('message').addClass('error');
    } else if (result.message) {
        html += result.message;
        model.parts.messageBox.removeClass('error').addClass('message');
    } else {
        return;
    }

    $('#repoMessage').html(html);

    model.parts.messageBox.show();

    setTimeout(function () {
        model.parts.messageBox.fadeOut(1000, function () {
        });
    }, timeOut);
};

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Utils **/

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

/** TextCompleter **/

var initTextComplete = function () {

    var strategies = [
        {
            match: /\b(\w+|"|'\)|"\)|')$/,
            search: function (term, callback) {
                getSuggesterValues(term, callback);
            },
            cache: true,
            context: contextFunc,
            index: 1,
            replace: function (word) {
                return word + '';
            }
        }
    ];

    var option = {
        placement: ""
    };

    $('#queryInput').textcomplete(strategies, option);
};

function getSuggesterValues(term, callback) {

    var queryInput = $('#queryInput');

    var data = {
        term: term,
        fullValue: queryInput.val()
    };

    jQuery.ajax({
        url: autocompleteServiceUrl,
        cache: true,
        type: 'GET',
        data: data,
        success: function (result) {
            callback(result.suggester.suggestions);
            updateQueryInput(result, $('#queryInput'));
        }
    });
}

var contextFunc = function (text) {
    return text.toLowerCase();
};

var updateQueryInput = function (result, element) {
    if (!result.suggester.valid) {
        element.css('color', 'red');
    } else {
        element.css('color', 'green');
    }
};

var deleteNode = function (nodeId) {

    var repoId = model.selectors.repo.val();
    var branchId = model.selectors.branch.val();

    var data = {
        repoId: repoId,
        branchId: branchId,
        nodeId: nodeId
    };

    jQuery.ajax({
        url: deleteNodeServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            renderMessage(result);
            doQuery();
        }
    });
};