var REPO_SELECTOR_ID = "#selectRepoId";
var REPO_INFO_BOX = "#repoInfoBox";


$(function () {
    getRepoList($(REPO_SELECTOR_ID));

    $(REPO_SELECTOR_ID).change(function () {
        getRepoInfo(this.value);
    });

});


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
        }
    });
};

var renderRepoInfoBox = function (result, rendered) {
    console.log("Result:", result);

    var repoInfo = result.repoInfo;

    var html = "";
    html += '<div class="card blue-grey lighten-1">';
    html += '<div class="card-content white-text">';
    html += '<span class="card-title">' + repoInfo.id + '</span>';
    html += '<p>';

    html += '<table>';
    html += '<th>Branch name</th><th>Number of nodes</th><th></th>';

    repoInfo.branchInfo.forEach(function (branch) {
        html += "<tr>";
        html += '<td>' + branch.branch + '</td><td>' + branch.total + '</td>';
        html += "</tr>";
    });

    html += '</table>';
    html += '</p>';
    html += '</div>';
    html += '</div>';

    rendered.html(html);
};


/*

 <ul class="collection with-header">
 <li class="collection-header"><h4>First Names</h4></li>
 <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
 <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
 <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
 <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
 </ul>


 */
