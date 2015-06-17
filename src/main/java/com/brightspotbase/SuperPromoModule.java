package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;

@Renderer.Path("/render/modules/super-promo-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
public class SuperPromoModule extends Content implements FullWidthModule {

    private String name;
    @ToolUi.OnlyPathed
    private PromotableContent promotedContent;
    @ToolUi.Placeholder(dynamicText = "${content.promotedContent.promoData.promoTitle}", editable = true)
    private String title;
    @ToolUi.ColorPicker
    private String titleColor;
    @ToolUi.RichText
    private String description;
    private Image image;
    @ToolUi.Note("Custom link")
    private Link link;
    @ToolUi.Note("External content tag")
    private Tag tag;


    public String getTitleColor(){
        return titleColor;
    }
    
    public void setTitleColor(String titleColor){
        this.titleColor = titleColor;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
