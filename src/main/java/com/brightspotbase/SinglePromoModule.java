package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Recordable;

@Renderer.Path("/render/modules/single-promo-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
@Recordable.Embedded
public class SinglePromoModule extends Content implements HalfWidthModule {

    @ToolUi.OnlyPathed
    private PromotableContent promotedContent;
    @ToolUi.Placeholder(dynamicText = "${content.promotedContent.promoData.promoTitle}", editable = true)
    private String title;
    private Image image;
    @ToolUi.Note("Custom link")
    private Link link;

    public PromotableContent getPromotedContent() {
        return promotedContent;
    }

    public void setPromotedContent(PromotableContent promotedContent) {
        this.promotedContent = promotedContent;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    @Override
    public String getLabel() {
        return getPromotedContent() != null ? getPromotedContent().getState().getLabel() : null;
    }
}
