package me.myklebust.repo.xplorer.autocomplete;

import me.myklebust.repo.xplorer.autocomplete.mapper.AutocompleteResultMapper;
import me.myklebust.repo.xplorer.autocomplete.producers.SuggestionProducers;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class AutocompleterBean
    implements ScriptBean
{
    private SuggestionProducers producers;

    @SuppressWarnings("unused")
    public Object execute( final String term, final String fullValue )
    {
        final AutocompleteResult.Builder result = AutocompleteResult.create();
        result.isValid( QueryStringValidator.isValid( fullValue ) );

        result.fullValue( fullValue );
        result.newPart( "" );

        result.addSuggests( producers.match( term ) );

        return new AutocompleteResultMapper( result.build() );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.producers = context.getService( SuggestionProducers.class ).get();
    }

}
