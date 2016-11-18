var mustache = require('/lib/xp/mustache');
var portal = require('/lib/xp/portal');
var repoLib = require('/lib/xp/repo');


exports.get = function (req) {

    var view = resolve('repoxplorer.html');


    var model = {
        jsUrl: portal.assetUrl({path: "/js/main.js"}),
        assetsUrl: portal.assetUrl({path: ""}),
        repoLoaderService: getServiceUrl('repo-loader-service'),
        repoInfoService: getServiceUrl('repo-info-service')
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
