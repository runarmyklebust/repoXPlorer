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
    model.buttons.deleteRepoConfirm = $('#deleteConfirmButton');
    model.buttons.deleteRepoConfirmCancel = $('#deleteConfirmCancelButton');

    model.inputs.createRepo = $('#createRepoId');
    model.inputs.createBranch = $('#createBranchInput');
    model.inputs.fulltext = $('#fulltextSearch');
    model.inputs.query = $('#queryInput');
    model.inputs.count = $('#queryCountInput');
    model.inputs.start = $('#queryStart');
    model.inputs.order = $('#querySortInput');

    model.selectors.repo = $('#selectRepoId');
    model.selectors.branch = $('#selectBranchId');
    model.selectors.deleteRepo = $('#deleteRepoSelector');
    model.selectors.createBranch = $('#createBranchSelector');

    model.links.deleteRepo = $('#deleteModalOpen');
    model.links.createBranch = $('#createBranchModalOpen');
    model.links.createRepo = $('#createRepoModalOpen');

    model.modals.deleteRepo = $('#deleteRepoModal');
    model.modals.createBranch = $('#createBranchModal');
    model.modals.createRepo = $('#createRepoModal');

    model.parts.deleteRepoConfirm = $('#deleteConfirm');
    model.parts.queryResult = $('#queryResultBox');
    model.parts.messageBox = $('#messageBox');
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

    model.links.deleteRepo.click(function () {
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

function initCreateBranchModalDialog() {
    model.links.createBranch.click(function () {
        console.log("Open branch modal");
        getRepoList(model.selectors.createBranch);
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
    model.parts.messageBox.hide();
    setStartLayout();
};

var setStartLayout = function () {
    $(QUERY_PANEL).show();
    $(BROWSE_PANEL).hide();
    $(DIFF_PANEL).hide();
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

    console.log("Data create branch: ", data);

    jQuery.ajax({
        url: createBranchServiceUrl,
        cache: false,
        data: data,
        type: 'POST',
        success: function (result) {
            model.modals.createBranch.modal('hide');
            renderMessage(result);
            //  getRepoList(model.selectors.repo);
            //  repoIdInput.val('');
            //setStartLayout();
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
    var start = model.inputs.start.val();
    var sort = model.inputs.order.val();

    var data = {
        repoId: repoId,
        queryString: queryString,
        fulltext: fulltext,
        branch: branch,
        count: count,
        start: start,
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

    var start = Number(queryResult.start);
    var count = Number(queryResult.count);
    var to = start + count;
    var from = start + 1;

    html += "<p>QueryTime: " + queryResult.queryTime + "ms, FetchTime: " + queryResult.fetchTime + "ms</p>";
    html += "<p>Showing hits: " + from + "->" + to + " of " + queryResult.total + "</p>";

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

    var timeOut = 2500;

    if (result.error) {
        timeOut = 5000;
        html += result.error;
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
