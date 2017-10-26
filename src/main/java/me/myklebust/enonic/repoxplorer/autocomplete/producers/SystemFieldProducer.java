package me.myklebust.enonic.repoxplorer.autocomplete.producers;

import java.util.Collection;
import java.util.List;

import org.osgi.service.component.annotations.Component;

import com.google.common.collect.Lists;

import me.myklebust.enonic.repoxplorer.autocomplete.SuggestionProducer;
import me.myklebust.enonic.repoxplorer.autocomplete.context.ProducerContext;

import com.enonic.xp.node.NodeIndexPath;

@Component
public class SystemFieldProducer
    extends AbstractProducer
    implements SuggestionProducer

{

    private List<String> suggestions = Lists.newArrayList( NodeIndexPath.ALL_TEXT.getPath(), //
                                                           NodeIndexPath.NAME.getPath(), //
                                                           NodeIndexPath.PARENT_PATH.getPath(), //
                                                           NodeIndexPath.PATH.getPath(),//
                                                           NodeIndexPath.ID.getPath(), //
                                                           NodeIndexPath.REFERENCE.getPath(), //
                                                           NodeIndexPath.TIMESTAMP.getPath(), //
                                                           NodeIndexPath.VERSION.getPath(), //
                                                           NodeIndexPath.MANUAL_ORDER_VALUE.getPath() //
    );

    @Override
    protected Collection<String> getSuggestionEntries()
    {
        return suggestions;
    }

    @Override
    public String name()
    {
        return "SystemField";
    }

    @Override
    public List<String> produce( final String term, final ProducerContext context )
    {
        return doMatch( term, context );
    }
}
