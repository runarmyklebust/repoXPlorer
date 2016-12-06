package me.myklebust.repo.xplorer.autocomplete;

import java.util.List;

import me.myklebust.repo.xplorer.autocomplete.context.ProducerContext;

public interface SuggestionProducer
{
    String name();

    List<String> produce( final String term, final ProducerContext context );
}
