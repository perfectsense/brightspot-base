package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;

import java.util.List;

@Renderer.Path("/render/modules/medium-promo-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
public class MediumPromoModule extends Content implements FullWidthModule {

    private String name;
    @ToolUi.Heading("Dynamic Tag Driven")
    @Indexed
    private Tag tag;
    @ToolUi.Heading("Curated Content")
    @Embedded
    private List<Promo> promos;

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }

    public List<Promo> getPromos() {
        return promos;
    }

    public void setPromos(List<Promo> promos) {
        this.promos = promos;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PaginatedResult<PromotableContent> getTaggedContent(Site site) {
        Query query = Query.from(PromotableContent.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.where("tags = ?", this.tag).select(0, 2);
    }
}
