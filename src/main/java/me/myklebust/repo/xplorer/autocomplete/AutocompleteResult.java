package me.myklebust.repo.xplorer.autocomplete;

public class AutocompleteResult
{
    private final boolean isValid;

    private final String newPart;

    private final String fullValue;

    private AutocompleteResult( final Builder builder )
    {
        fullValue = builder.fullValue;
        newPart = builder.newPart;
        isValid = builder.isValid;
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

    public static Builder create()
    {
        return new Builder();
    }


    public static final class Builder
    {
        private String fullValue;

        private String newPart;

        private boolean isValid;

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

        public AutocompleteResult build()
        {
            return new AutocompleteResult( this );
        }
    }
}
