package me.myklebust.enonic.repoxplorer.autocomplete;

import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;
import me.myklebust.enonic.repoxplorer.autocomplete.mapper.AutocompleteResultMapper;
import me.myklebust.enonic.repoxplorer.autocomplete.producers.SuggestionProducers;

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

        result.addSuggests( producers.match( term, ProducerContext.IS_NEW_EXPRESSION ) );

        return new AutocompleteResultMapper( result.build() );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.producers = context.getService( SuggestionProducers.class ).get();
    }

}
