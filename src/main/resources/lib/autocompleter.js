var bean = __.newBean('me.myklebust.repo.xplorer.autocomplete.AutocompleterBean');


exports.execute = function (value) {
    var result = bean.execute(value);
    return __.toNativeObject(result);
};


