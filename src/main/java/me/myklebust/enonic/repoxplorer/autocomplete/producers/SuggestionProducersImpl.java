package me.myklebust.enonic.repoxplorer.autocomplete.producers;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

import com.google.common.collect.Lists;

import me.myklebust.enonic.repoxplorer.autocomplete.SuggestionProducer;
import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

import com.enonic.xp.web.handler.WebHandler;

@Component(immediate = true)
public class SuggestionProducersImpl
    implements SuggestionProducers
{
    private final List<SuggestionProducer> producerList = Lists.newArrayList();

    @Override
    public List<String> match( final String term, final ProducerContext context )
    {
        List<String> suggestions = Lists.newArrayList();

        producerList.forEach( ( producer ) -> {
            suggestions.addAll( producer.produce( term, context ) );
        } );

        return suggestions;
    }

    @Reference(cardinality = ReferenceCardinality.MULTIPLE, policy = ReferencePolicy.DYNAMIC)
    public void addSuggestionProducer( final SuggestionProducer producer )
    {
        this.producerList.add( producer );
    }


    public void removeSuggestionProducer( final SuggestionProducer producer )
    {
        this.producerList.remove( producer );
    }


}
