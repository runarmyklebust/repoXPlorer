"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _freemarker = require("/site/lib/tineikt/freemarker");

var portal = require('/lib/xp/portal');

function get() {
  var view = resolve('repoxplorer.html');
  var model = {
    jsUrl: portal.assetUrl({
      path: "/js/main.js"
    }),
    assetsUrl: portal.assetUrl({
      path: ""
    }),
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
    body: (0, _freemarker.render)(view, model)
  };
}

function getServiceUrl(name) {
  return portal.serviceUrl({
    service: name
  });
}