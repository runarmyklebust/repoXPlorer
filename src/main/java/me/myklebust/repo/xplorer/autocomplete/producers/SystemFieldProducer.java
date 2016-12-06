package me.myklebust.repo.xplorer.autocomplete.producers;

import java.util.Collection;
import java.util.List;

import org.osgi.service.component.annotations.Component;

import com.google.common.collect.Lists;

import me.myklebust.repo.xplorer.autocomplete.SuggestionProducer;
import me.myklebust.repo.xplorer.autocomplete.context.ProducerContext;

@Component
public class SystemFieldProducer
    extends AbstractProducer
    implements SuggestionProducer

{

    private List<String> suggestions =
        Lists.newArrayList( "_allText", "_name", "_parentPath", "_path", "_id", "_reference", "_timestamp", "_versionKey",
                            "_manualordervalue" );

    @Override
    protected Collection<String> getSuggestionEntries()
    {
        return suggestions;
    }

    @Override
    public String name()
    {
        return "SystemField";
    }

    @Override
    public List<String> produce( final String term, final ProducerContext context )
    {
        return doMatch( term, context );
    }
}
