package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/model/stories-page.jsp")
public class StoriesPage extends Content implements Branded {

    @Required
    private String name;
    private Story promotedStory;


    public Story getPromotedStory() {
        return promotedStory;
    }

    public void setPromotedStory(Story promotedStory) {
        this.promotedStory = promotedStory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public PaginatedResult<Story> getStories(Site site) {
        Query query = Query.from(Story.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.sortDescending(Content.PUBLISH_DATE_FIELD).select(0, 12);
    }
}
