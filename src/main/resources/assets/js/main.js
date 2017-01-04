var CREATE_REPO_INPUT = '#createRepoId';

var DELETE_CONFIRM_MESSAGE = "#deleteConfirmMessage";


var QUERY_PANEL = '#queryPanel';
var BROWSE_PANEL = '#browsePanel';
var DIFF_PANEL = '#diffPanel';
var INTEGRITY_PANEL = '#integrityPanel';
var panels = [QUERY_PANEL, BROWSE_PANEL, DIFF_PANEL, INTEGRITY_PANEL];

var EVENT_REPO_CONNECTED = "repoXPlorer:repo:connected";
var EVENT_REPO_DISCONNECTED = "repoXPlorer:repo:disconnected";

var MESSAGE_BOX = '#messageBox';

var model = {
    buttons: {},
    selectors: {},
    inputs: {},
    modals: {},
    parts: {},
    input: {}
};

$(function () {

    initializeModel();

    initializeView();

    initComponentEventHandlers();

    initDeleteModalDialog();

    getRepoList(model.selectors.repo);

    model.selectors.repo.change(function () {
        model.selectors.repo.trigger(EVENT_REPO_DISCONNECTED);
        setChangeRepoLayout();
        getRepoInfo(this.value);
    });

    model.selectors.branch.change(function () {
        model.selectors.branch.trigger(EVENT_REPO_CONNECTED);
    });

    model.buttons.createRepo.click(function () {
        createRepo();
    });

    model.buttons.query.click(function () {
        doQuery();
    });

    initQueryModeListener();

    activateNavbar();
});

function initializeModel() {

    model.buttons.query = $('#queryButton');
    model.buttons.createRepo = $('#createRepoButton');
    model.buttons.deleteRepo = $('#deleteRepoButton');
    model.buttons.deleteRepoConfirm = $('#deleteConfirmButton');
    model.buttons.deleteRepoConfirmCancel = $('#deleteConfirmCancelButton');

    model.inputs.fulltext = $('#fulltextSearch');
    model.inputs.query = $('#queryInput');
    model.inputs.count = $('#queryCountInput');
    model.inputs.order = $('#querySortInput');

    model.selectors.repo = $('#selectRepoId');
    model.selectors.branch = $('#selectBranchId');
    model.selectors.deleteRepo = $('#deleteRepoSelector');

    model.modals.deleteRepo = $('#deleteModalOpen');

    model.parts.deleteRepoConfirm = $('#deleteConfirm');
    model.parts.queryResult = $('#queryResultBox');
}

function initComponentEventHandlers() {

    $(document).on(EVENT_REPO_CONNECTED, function () {
        enableElement(model.inputs.fulltext);
        enabledButton(model.buttons.query);
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
        }, 200);
    });

    model.inputs.query.keyup(function () {
        delay(function () {
            toggleQueryMode();
        }, 200);
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

    model.modals.deleteRepo.click(function () {
        enableElement(model.selectors.deleteRepo);
        model.parts.deleteRepoConfirm.hide();
        disableButton(model.buttons.deleteRepo);
        getRepoList(model.selectors.deleteRepo);
    });

    model.selectors.deleteRepo.change(function () {
        enabledButton(model.buttons.deleteRepo);
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
            }
        });
    });

    model.buttons.deleteRepoConfirm.click(function () {
        deleteRepo();
        model.parts.deleteRepoConfirm.hide();
        disableButton(model.buttons.deleteRepo);
        getRepoList(model.selectors.deleteRepo);
        enableElement(model.selectors.deleteRepo);
    });

    model.buttons.deleteRepoConfirmCancel.click(function () {
        model.parts.deleteRepoConfirm.hide();
        disableButton(model.buttons.deleteRepo);
        getRepoList(model.selectors.deleteRepo);
        enableElement(model.selectors.deleteRepo);
    });
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

function togglePanel(name) {
    panels.forEach(function (panel) {
        if (panel === "#" + name) {
            $(panel).show();
        } else {
            $(panel).hide();
        }
    });
}

function activateNavbar() {
    $(".navbar a").on("click", function () {

        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });
}

var initializeView = function () {
    $(MESSAGE_BOX).hide();
    setStartLayout();
};

var setStartLayout = function () {
    $(QUERY_PANEL).show();
    model.parts.queryResult.hide();
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

var getRepoInfo = function (id) {
    var data = {
        repoId: id
    };

    jQuery.ajax({
        url: repoInfoService,
        cache: false,
        type: 'GET',
        data: data,
        success: function (result) {
            renderBranchList(result, model.selectors.branch);
        }
    });
};

function createRepo() {
    var repoIdInput = $(CREATE_REPO_INPUT);
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
            renderMessage(result);
            getRepoList(model.selectors.repo);
            repoIdInput.val('');
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
            renderMessage(result);
            getRepoList(model.selectors.repo);
            setStartLayout();
        }
    });
}

function doQuery() {

    var queryString = model.inputs.query.val();
    var fulltext = model.inputs.fulltext.val();
    var repoId = model.selectors.repo.find(":selected").text();
    var branch = model.selectors.branch.val();
    var count = model.inputs.count.val();
    var sort = model.inputs.order.val();

    var data = {
        repoId: repoId,
        queryString: queryString,
        fulltext: fulltext,
        branch: branch,
        count: count,
        sort: sort
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

    if (result.error) {
        renderMessage(result);
        return;
    }

    var queryResult = result.queryResult;

    var html = "";
    html = renderQueryMetaData(html, queryResult);

    html = renderQueryHits(html, queryResult);

    renderer.html(html);

    Prism.highlightAll();
    renderer.show();
};

function renderQueryMetaData(html, queryResult) {

    html += "<p>QueryTime: " + queryResult.queryTime + "ms, FetchTime: " + queryResult.fetchTime + "ms</p>";
    html += "<p>Showing hits: " + queryResult.count + " of " + queryResult.total + "</p>";

    return html;
}


var renderQueryHits = function (html, result) {

    var i = 0;
    result.hits.forEach(function (hit) {
        html = renderQueryHit(html, hit, i++);
    });
    return html;
};

var renderQueryHit = function (html, hit, itemNum) {

    var collapseId = "collapse-" + itemNum;
    var headerId = "header-" + itemNum;

    html += '<div class="card">';
    html += '  <div class="card-header" role="tab" id="' + headerId + '">';
    html += '    <a class="collapsed" data-toggle="collapse" data-parent="#queryHitView" href="#' + collapseId +
            '" aria-expanded="false" aria-controls="' + collapseId + '">';
    html += hit._path + " - (" + hit._score + ")";
    html += '    </a>';
    html += '  </div>';
    html += '  <div id="' + collapseId + '" class="collapse" role="tabpanel" aria-labelledby="' + headerId + '">';
    html += '   <div class="card-block">';
    html += '     <pre>';
    html += '       <code class="language-javascript">';
    html += JSON.stringify(hit.node, null, 4);
    html += '      </code>';
    html += '     </pre>';
    html += '   </div>';
    html += '  </div>';
    html += '</div>';

    return html;
};

var renderMessage = function (result) {

    var html = "";
    var messageBox = $(MESSAGE_BOX);

    if (result.error) {
        html += result.error;
        messageBox.removeClass('message').addClass('error');
    } else if (result.message) {
        html += result.message;
        messageBox.removeClass('error').addClass('message');
    } else {
        return;
    }

    $('#repoMessage').html(html);

    messageBox.show();

    setTimeout(function () {
        messageBox.fadeOut(1000, function () {
        });
    }, 2500);
};


/** Utils **/

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

