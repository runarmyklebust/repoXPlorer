package me.myklebust.repo.xplorer.autocomplete;

import com.enonic.xp.query.parser.QueryParser;

public class QueryStringValidator
{
    public static boolean isValid( final String value )
    {
        try
        {
            QueryParser.parse( value );
            return true;

        }
        catch ( Exception e )
        {
            return false;
        }
    }

}
