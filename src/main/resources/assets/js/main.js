var REPO_SELECTOR_ID = "#selectRepoId";
var REPO_INFO_BOX = "#repoInfoBox";

var BRANCH_SELECTOR_ID = "#selectBranchId";

var CREATE_REPO_BUTTON = '#createRepoButton';
var CREATE_REPO_INPUT = '#createRepoId';

var DELETE_REPO_BUTTON = '#deleteRepoButton';

var QUERY_PANEL = '#queryPanel';
var QUERY_BUTTON = '#queryButton';
var QUERY_INPUT = '#queryInput';
var QUERY_COUNT = '#queryCountInput';
var QUERY_RESULT_BOX = "#queryResultBox";
var QUERY_SORT_INPUT = "#querySortInput";

var MESSAGE_BOX = '#messageBox';

var BROWSE_PANEL = '#browsePanel';
var DIFF_PANEL = '#diffPanel';

var panels = [QUERY_PANEL, BROWSE_PANEL, DIFF_PANEL];

$(function () {

    initializeView();

    getRepoList($(REPO_SELECTOR_ID));

    $(REPO_SELECTOR_ID).change(function () {
        setChangeRepoLayout();
        getRepoInfo(this.value);
        enabledButton($(DELETE_REPO_BUTTON));
        $(QUERY_PANEL).show();
        enabledButton($(QUERY_BUTTON));
    });

    $(DELETE_REPO_BUTTON).click(function () {
        deleteRepo();
    });

    $(CREATE_REPO_BUTTON).click(function () {
        createRepo();
    });

    $(QUERY_BUTTON).click(function () {
        doQuery();
    });

    /* $(QUERY_INPUT).keyup(function () {
     delay(function () {
     autoCompleteQuery();
     }, 200);
     });
     */

    $('.modal').modal();
});

function togglePanel(name) {

    panels.forEach(function (panel) {
        if (panel === "#" + name) {
            $(panel).show();
        } else {
            $(panel).hide();
        }
    });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

var initializeView = function () {
    $(MESSAGE_BOX).hide();
    setStartLayout();
};

var setStartLayout = function () {
    $(REPO_INFO_BOX).hide();
    $(QUERY_PANEL).hide();
    $(QUERY_RESULT_BOX).hide();
    disableButton($(DELETE_REPO_BUTTON));
    //disableButton($(CREATE_REPO_BUTTON));
    disableButton($(QUERY_BUTTON));
};

var setChangeRepoLayout = function () {
    $(REPO_INFO_BOX).hide();
    $(QUERY_PANEL).hide();
    $(QUERY_RESULT_BOX).hide();
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
            renderBranchList(result, $(BRANCH_SELECTOR_ID));
            $(REPO_INFO_BOX).show();
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
            getRepoList($(REPO_SELECTOR_ID));
            repoIdInput.val('');
            setStartLayout();
        }
    });
}

function deleteRepo() {
    var repoId = $(REPO_SELECTOR_ID).find(":selected").text();

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
            getRepoList($(REPO_SELECTOR_ID));
            setStartLayout();
        }
    });
}


function doQuery() {
    var queryString = $(QUERY_INPUT).val();
    var repoId = $(REPO_SELECTOR_ID).find(":selected").text();
    var branch = $(BRANCH_SELECTOR_ID).val();
    var count = $(QUERY_COUNT).val();
    var sort = $(QUERY_SORT_INPUT).val();

    var data = {
        repoId: repoId,
        queryString: queryString,
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
            renderQueryResult(result, $(QUERY_RESULT_BOX));

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

var renderRepoInfoBox = function (result, rendered) {
    console.log("Result:", result);

    var repoInfo = result.repoInfo;

    var html = "";
    html += '<table class="bordered">';
    html += '<th>Branch</th><th>#nodes</th>';

    repoInfo.branchInfo.forEach(function (branch) {
        html += "<tr>";
        html += '<td>' + branch.branch + '</td><td>' + branch.total + '</td>';
        html += "</tr>";
    });

    html += '</table>';

    rendered.html(html);
};

var renderQueryResult = function (result, renderer) {

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

/*



 <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
 Collapsible Group Item #2
 </a>
 </h5>
 </div>
 <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
 <div class="card-block">
 Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
 </div>
 </div>
 </div>
 */


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
    }

    $('#repoMessage').html(html);

    messageBox.show();

    setTimeout(function () {
        messageBox.fadeOut(1000, function () {
        });
    }, 1500);
};


/** Utils **/

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

