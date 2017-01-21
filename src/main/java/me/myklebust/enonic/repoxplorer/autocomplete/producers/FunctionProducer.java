package me.myklebust.enonic.repoxplorer.autocomplete.producers;

import java.util.Collection;
import java.util.List;

import org.osgi.service.component.annotations.Component;

import com.google.common.collect.Lists;

import me.myklebust.enonic.repoxplorer.autocomplete.SuggestionProducer;
import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

@Component
public class FunctionProducer
    extends AbstractProducer
    implements SuggestionProducer
{
    private List<String> suggestions = Lists.newArrayList( "fulltext('", "ngram('", "pathMatch('", "range('" );


    @Override
    protected Collection<String> getSuggestionEntries()
    {
        return suggestions;
    }

    @Override
    public String name()
    {
        return "Functions";
    }

    @Override
    public List<String> produce( final String term, final ProducerContext context )
    {
        return doMatch( term, context );
    }

}
