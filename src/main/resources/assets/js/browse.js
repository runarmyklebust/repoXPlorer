var BROWSE_TREE = "#browseTree";

var renderTree = function () {
    var repoId = $(REPO_SELECTOR_ID).find(":selected").text();
    var branch = $(BRANCH_SELECTOR_ID).find(":selected").text();


    $(BROWSE_TREE).jstree({
            'core': {
                'data': {
                    'url': function (node) {
                        return browseServiceUrl + "?path=" + node.data("key") + "&repoId=" + node.data.repoId + "&branch=" + node.data.branch
                    },
                    type: 'get',
                    success: function (result) {
                        // this is called when the AJAX request is successful. "ops"
                        // contains the returned data from the server, which in
                        // my case is a json object containing an array of objects.
                        var data = [];
                        // go through data and create an array of objects to be given
                        // to jsTree just like when you're creating a static jsTree.

                        result.hits.forEach(function (entry) {
                            var node = {
                                data: {},
                                path: entry.path,
                                children: entry.children,
                                // THIS LINE BELOW IS THE MAGIC KEY!!! This will force
                                //  jsTree to consider the node
                                // openable and thus issue a new AJAX call hen the
                                // user clicks on the little "+" symbol or
                                // whatever opens nodes in your theme
                                state: "closed"
                            };
                            data.push(node);
                        });

                        return data; // this will return the formed array
                                     // "data" to jsTree which will turn
                                     // it into a list of nodes and
                                     // insert it into the tree.
                    }
                }
            }
        }
    );

};

