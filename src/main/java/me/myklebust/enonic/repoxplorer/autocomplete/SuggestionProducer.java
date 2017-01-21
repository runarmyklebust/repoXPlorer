package me.myklebust.enonic.repoxplorer.autocomplete;

import java.util.List;

import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

public interface SuggestionProducer
{
    String name();

    List<String> produce( final String term, final ProducerContext context );
}
