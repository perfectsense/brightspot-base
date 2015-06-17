package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/model/video-page.jsp")
public class VideoPage extends Content implements Branded {

    @Required
    private String name;
    private Video promotedVideo;


    public Video getPromotedVideo() {
        return promotedVideo;
    }

    public void setPromotedVideo(Video promotedVideo) {
        this.promotedVideo = promotedVideo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public PaginatedResult<Video> getVideos(Site site) {
        Query query = Query.from(Video.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.sortDescending(Content.PUBLISH_DATE_FIELD).select(0, 12);
    }
}
