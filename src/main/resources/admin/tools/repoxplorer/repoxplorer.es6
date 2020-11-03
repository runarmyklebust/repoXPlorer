import { render } from '/lib/thymeleaf';
import { assetUrl, serviceUrl } from '/lib/xp/portal';

const viewFile = 'repoxplorer.html';
export function get() {
  const model = {
    jsUrl: assetUrl({ path: '/js/main.js' }),
    assetsUrl: assetUrl({ path: '' }),
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
    body: render(resolve(viewFile), model)
  };
}

function getServiceUrl(name) {
  return serviceUrl({
    service: name
  });
}
