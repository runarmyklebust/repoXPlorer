package me.myklebust.repo.xplorer.autocomplete;

import java.util.List;

public interface SuggestionProducer
{
    String name();

    List<String> produce( final String term );
}
