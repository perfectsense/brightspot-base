package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/model/galleries-page.jsp")
public class GalleriesPage extends Content implements Branded {

    @Required
    private String name;
    private Gallery promotedGallery;

    public Gallery getPromotedGallery() {
        return promotedGallery;
    }

    public void setPromotedGallery(Gallery promotedGallery) {
        this.promotedGallery = promotedGallery;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private transient long offset = 0;

    public PaginatedResult<Gallery> getGalleries(Site site) {
        Query query = Query.from(Gallery.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.sortDescending(Content.PUBLISH_DATE_FIELD).select(0,12);
    }
}

