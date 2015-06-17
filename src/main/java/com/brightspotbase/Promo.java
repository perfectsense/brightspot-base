package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.db.ReferentialText;

@Recordable.Embedded
public class Promo extends Content {

    @ToolUi.OnlyPathed
    private PromotableContent promotedContent;
    @ToolUi.Placeholder(dynamicText = "${content.promotedContent.promoData.promoTitle}", editable = true)
    private String title;
    private Image image;
    private ReferentialText description;
    @ToolUi.Note("Override content tag")
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

    @Override
    public String getLabel() {
        return getPromotedContent() != null ? getPromotedContent().getState().getLabel() : null;
    }
}