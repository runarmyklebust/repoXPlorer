var bean = __.newBean('me.myklebust.enonic.repoxplorer.autocomplete.AutocompleterBean');


exports.execute = function (term, fullValue) {
    var result = bean.execute(term, fullValue);
    return __.toNativeObject(result);
};


