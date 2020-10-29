"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _thymeleaf = require("/lib/thymeleaf");

var _portal = require("/lib/xp/portal");

var viewFile = 'repoxplorer.html';

function get() {
  var model = {
    jsUrl: (0, _portal.assetUrl)({
      path: '/js/main.js'
    }),
    assetsUrl: (0, _portal.assetUrl)({
      path: ''
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
    body: (0, _thymeleaf.render)(resolve(viewFile), model)
  };
}

function getServiceUrl(name) {
  return (0, _portal.serviceUrl)({
    service: name
  });
}