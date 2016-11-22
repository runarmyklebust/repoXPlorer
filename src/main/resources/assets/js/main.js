var REPO_SELECTOR_ID = "#selectRepoId";
var REPO_INFO_BOX = "#repoInfoBox";

var CREATE_REPO_BUTTON = '#createRepoButton';
var CREATE_REPO_INPUT = '#createRepoId';

var DELETE_REPO_BUTTON = '#deleteRepoButton';

var QUERY_DIV = '#query';
var QUERY_BUTTON = '#queryButton';
var QUERY_INPUT = '#queryInput';
var QUERY_RESULT_BOX = "#queryResultBox";

var MESSAGE_BOX = '#messageBox';

$(function () {

    initializeView();

    getRepoList($(REPO_SELECTOR_ID));

    $(REPO_SELECTOR_ID).change(function () {
        getRepoInfo(this.value);
        enabledButton($(DELETE_REPO_BUTTON));
        $(QUERY_DIV).show();
    });

    $(CREATE_REPO_INPUT).keyup(setCreateRepoButtonState);

    $(QUERY_INPUT).keyup(setQueryButtonState);

    $(DELETE_REPO_BUTTON).click(function () {
        deleteRepo();
    });

    $(CREATE_REPO_BUTTON).click(function () {
        createRepo();
    });

    $(QUERY_BUTTON).click(function () {
        doQuery();
    });

    $('.modal').modal();
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

var initializeView = function () {
    $(MESSAGE_BOX).hide();
    setStartLayout();
};

var setStartLayout = function () {
    $(REPO_INFO_BOX).hide();
    $(QUERY_DIV).hide();
    disableButton($(DELETE_REPO_BUTTON));
    disableButton($(CREATE_REPO_BUTTON));
    disableButton($(QUERY_BUTTON));
};

var disableButton = function (element) {
    element.prop("disabled", true);
};

var enabledButton = function (element) {
    element.prop("disabled", false);
};

var setCreateRepoButtonState = function () {
    setTextInputButtonState($(CREATE_REPO_INPUT), $(CREATE_REPO_BUTTON));
};

var setQueryButtonState = function () {
    setTextInputButtonState($(QUERY_INPUT), $(QUERY_BUTTON));
};

var setTextInputButtonState = function (input, button) {
    if (!isEmpty(input.val())) {
        enabledButton(button);
    } else {
        disableButton(button);
    }
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
            renderRepoInfoBox(result, $(REPO_INFO_BOX));
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

    var data = {
        repoId: repoId,
        queryString: queryString
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

    console.log("Rendering element ", renderer);

    renderer.html(html);
    renderer.material_select();
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

    var html = '<ul class="collapsible" data-collapsible="accordion">';

    result.result.hits.forEach(function (hit) {
        html = renderQueryHit(html, hit);
    });

    html += '</ul>';
    renderer.html(html);

    $('.collapsible').collapsible();
};


function renderQueryHit(html, hit) {
    html += '<li class="queryResultItem">';
    html += '<div class="collapsible-header">';
    html += '<b>' + hit._path + '</b> ( score: ' + hit._score + ' )';
    html += '</div>';
    html += '<div class="collapsible-body">';
    html += '<pre>';
    html += '<code>';
    html += JSON.stringify(hit.node, null, 4);
    html += '</code>';
    html += '</pre>';
    html += '</div>';
    html += '</li>';
    return html;
}

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


