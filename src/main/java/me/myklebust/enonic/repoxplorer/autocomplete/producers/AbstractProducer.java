package me.myklebust.enonic.repoxplorer.autocomplete.producers;

import java.util.Collection;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

public abstract class AbstractProducer
{

    protected abstract Collection<String> getSuggestionEntries();

    protected final List<String> doMatch( final String term, final ProducerContext context )
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
