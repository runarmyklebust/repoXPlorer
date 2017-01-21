package me.myklebust.enonic.repoxplorer.autocomplete.context;

import java.util.List;

import com.google.common.collect.Lists;

import static me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext.IN_FUNCTION_IS_FIELDNAME;
import static me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext.IS_NEW_EXPRESSION;

public class ContextResolver
{
    private final static String FULLTEXT_FIRST_VAR_PATTERN = "fulltext('";

    private final static String NGRAM_FIRST_VAR_PATTERN = "ngram('";

    private List<ProducerContext> resolve( final String fullValue )
    {
        List<ProducerContext> contextList = Lists.newArrayList();

        if ( fullValue.length() == 0 )
        {
            contextList.add( IS_NEW_EXPRESSION );
            return contextList;
        }

        if ( fullValue.endsWith( FULLTEXT_FIRST_VAR_PATTERN ) )
        {
            contextList.add( IN_FUNCTION_IS_FIELDNAME );
        }

        return contextList;
    }
}
