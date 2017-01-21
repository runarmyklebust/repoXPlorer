package me.myklebust.enonic.repoxplorer.autocomplete.producers;

import java.util.List;

import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

public interface SuggestionProducers
{

    List<String> match( final String term, final ProducerContext context );

}
