package me.myklebust.repo.xplorer.autocomplete.producers;

import java.util.List;

public interface SuggestionProducers
{

    List<String> match( final String term );

}
