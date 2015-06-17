package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;

@Renderer.Path("/render/modules/callout-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(300)
public class CalloutModule extends Content implements FullWidthModule {

    private String title;
    private String accentTitle;
    private Link link;
    @ToolUi.Tab("Colors")
    @ToolUi.ColorPicker
    private String textColor;
    @ToolUi.Tab("Colors")
    @ToolUi.ColorPicker
    private String backgroundColor;
    @ToolUi.Tab("Colors")
    @ToolUi.ColorPicker
    private String buttonColor;
    @ToolUi.Tab("Colors")
    @ToolUi.ColorPicker
    private String buttonTextColor;

    public String getAccentTitle() {
        return accentTitle;
    }

    public void setAccentTitle(String accentTitle) {
        this.accentTitle = accentTitle;
    }

    public String getButtonColor() {
        return buttonColor;
    }

    public void setButtonColor(String buttonColor) {
        this.buttonColor = buttonColor;
    }

    public String getButtonTextColor() {
        return buttonTextColor;
    }

    public void setButtonTextColor(String buttonTextColor) {
        this.buttonTextColor = buttonTextColor;
    }

    public String getTextColor() {
        return textColor;
    }

    public void setTextColor(String textColor) {
        this.textColor = textColor;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
