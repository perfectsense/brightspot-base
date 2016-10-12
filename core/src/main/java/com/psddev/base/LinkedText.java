package com.psddev.base;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.StringUtils;

@Recordable.Embedded
public class LinkedText extends Record {

    @ToolUi.Placeholder(dynamicText = "${content.textFallback}")
    private String text;

    @Required
    private Link link = new ContentLink();

    public String getText() {
        return text;
    }

    public String getTextFallback() {
        Link link = getLink();
        return link != null ? link.getLinkText() : null;
    }

    public String getTextFinal() {
        String text = getText();
        return !StringUtils.isBlank(text) ? text : getTextFallback();
    }

    public void setText(String text) {
        this.text = text;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    @Override
    public String getLabel() {
        return getTextFinal();
    }
}
