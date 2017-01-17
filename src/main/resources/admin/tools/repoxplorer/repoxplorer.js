var mustache = require('/lib/xp/mustache');
var portal = require('/lib/xp/portal');
var repoLib = require('/lib/xp/repo');


exports.get = function (req) {

    var view = resolve('repoxplorer.html');


    var model = {
        jsUrl: portal.assetUrl({path: "/js/main.js"}),
        assetsUrl: portal.assetUrl({path: ""}),
        repoLoaderService: getServiceUrl('repo-loader-service'),
        repoInfoService: getServiceUrl('repo-info-service'),
        deleteRepoServiceUrl: getServiceUrl('delete-repo-service'),
        createRepoServiceUrl: getServiceUrl('create-repo-service'),
        createBranchServiceUrl: getServiceUrl('create-branch-service'),
        queryRepoServiceUrl: getServiceUrl('query-repo-service'),
        browseServiceUrl: getServiceUrl('browse-service'),
        autocompleteServiceUrl: getServiceUrl('autocomplete-service'),
        deleteNodeServiceUrl: getServiceUrl('delete-node-service'),
        deleteBranchServiceUrl: getServiceUrl('delete-branch-service')
    };

    return {
        contentType: 'text/html',
        body: mustache.render(view, model)
    };

};

var getServiceUrl = function (name) {

    return portal.serviceUrl({
        service: name
    })
};
