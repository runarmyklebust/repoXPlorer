package me.myklebust.repo.xplorer.autocomplete.producers;

import java.util.Collection;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public abstract class AbstractProducer
{

    protected abstract Collection<String> getSuggestionEntries();

    protected final List<String> doMatch( final String term )
    {
        return getSuggestionEntries().stream().
            filter( match -> match.startsWith( term ) ).
            collect( Collectors.toList() );
    }

    protected class SuggestEntry
    {
        private Pattern pattern;

        private String suggestion;

        public SuggestEntry( final String pattern, final String suggestion )
        {
            this.pattern = Pattern.compile( pattern );
            this.suggestion = suggestion;
        }
    }


}
