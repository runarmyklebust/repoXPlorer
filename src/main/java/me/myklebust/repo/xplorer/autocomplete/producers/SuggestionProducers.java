package me.myklebust.repo.xplorer.autocomplete.producers;

import java.util.List;

import me.myklebust.repo.xplorer.autocomplete.context.ProducerContext;

public interface SuggestionProducers
{

    List<String> match( final String term, final ProducerContext context );

}
