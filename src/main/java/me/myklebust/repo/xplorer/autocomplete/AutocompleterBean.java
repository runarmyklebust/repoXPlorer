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
    public Object execute( final String currentValue )
    {
        final AutocompleteResult.Builder result = AutocompleteResult.create();
        result.isValid( QueryStringValidator.isValid( currentValue ) );

        result.fullValue( currentValue );
        result.newPart( "" );

        result.addSuggests( producers.match( currentValue ) );

        return new AutocompleteResultMapper( result.build() );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.producers = context.getService( SuggestionProducers.class ).get();
    }

}
