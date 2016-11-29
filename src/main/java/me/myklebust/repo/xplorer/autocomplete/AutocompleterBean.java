package me.myklebust.repo.xplorer.autocomplete;

import me.myklebust.repo.xplorer.autocomplete.mapper.AutocompleteResultMapper;

import com.enonic.xp.query.parser.QueryParser;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class AutocompleterBean
    implements ScriptBean
{
    @SuppressWarnings("unused")
    public Object execute( final String currentValue )
    {
        final AutocompleteResult.Builder result = AutocompleteResult.create();

        try
        {
            QueryParser.parse( currentValue );
            result.isValid( true );
        }
        catch ( Exception e )
        {
            result.isValid( false );
        }

        result.fullValue( currentValue );
        result.newPart( "" );

        return new AutocompleteResultMapper( result.build() );
    }

    @Override
    public void initialize( final BeanContext context )
    {

    }
}
