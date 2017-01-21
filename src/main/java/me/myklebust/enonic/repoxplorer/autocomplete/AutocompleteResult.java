package me.myklebust.enonic.repoxplorer.autocomplete;

import java.util.Collection;
import java.util.List;

import com.google.common.collect.Lists;

public class AutocompleteResult
{
    private final boolean isValid;

    private final String newPart;

    private final String fullValue;

    private final List<String> suggestions;

    private AutocompleteResult( final Builder builder )
    {
        this.fullValue = builder.fullValue;
        this.newPart = builder.newPart;
        this.isValid = builder.isValid;
        this.suggestions = builder.suggestions;
    }

    public boolean isValid()
    {
        return isValid;
    }

    public String getNewPart()
    {
        return newPart;
    }

    public String getFullValue()
    {
        return fullValue;
    }

    public List<String> getSuggestions()
    {
        return suggestions;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public static final class Builder
    {
        private String fullValue;

        private String newPart;

        private boolean isValid;

        private final List<String> suggestions = Lists.newArrayList();


        private Builder()
        {
        }

        public Builder fullValue( final String val )
        {
            fullValue = val;
            return this;
        }

        public Builder newPart( final String val )
        {
            newPart = val;
            return this;
        }

        public Builder isValid( final boolean val )
        {
            isValid = val;
            return this;
        }

        public Builder addSuggest( final String suggest )
        {
            this.suggestions.add( suggest );
            return this;
        }

        public Builder addSuggests( final Collection suggests )
        {
            this.suggestions.addAll( suggests );
            return this;
        }

        public AutocompleteResult build()
        {
            return new AutocompleteResult( this );
        }
    }
}
