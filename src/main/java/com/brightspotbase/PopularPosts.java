package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;

@Renderer.Path("/render/modules/popular-posts-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(300)
public class PopularPosts extends Content implements HalfWidthModule, DoubleHeightModule {

    private String name;

    private static final int DEFAULT_NUMBER_OF_POSTS = 8;

    @ToolUi.Note("Number of Posts to show")
    private int numberOfPosts = DEFAULT_NUMBER_OF_POSTS;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PaginatedResult<Story> getPopularContent(Site site) {
        int numToLoad = numberOfPosts;
        Query query = Query.from(Story.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.sortDescending("analytics.views").select(0, numToLoad);
    }


}