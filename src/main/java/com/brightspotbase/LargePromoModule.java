package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ReferentialText;

@Renderer.Path("/render/modules/large-promo-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
public class LargePromoModule extends Content implements FullWidthModule {

    private String name;
    @ToolUi.OnlyPathed
    private PromotableContent promotedContent;
    @ToolUi.Placeholder(dynamicText = "${content.promotedContent.promoData.promoTitle}", editable = true)
    private String title;
    private ReferentialText description;
    private Image image;
    @ToolUi.Note("Custom tag")
    private Tag tag;
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


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ReferentialText getDescription() {
        return description;
    }

    public void setDescription(ReferentialText description) {
        this.description = description;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }
}
