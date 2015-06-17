package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable.Embedded;
import org.apache.commons.lang.StringUtils;

@Embedded
public class Link extends Record {

    private String text;
    @ToolUi.Note("Start all external links with http://")
    @ToolUi.Placeholder(value = "http://")
    private String url;

    @ToolUi.OnlyPathed
    private Content content;

    public enum Target {

        _blank("New Window");
        private String value;

        private Target(String pValue) {
            value = pValue;
        }

        public String toString() {
            return value;
        }
    }

    private Target target;

    public String getText() {
        return (!StringUtils.isBlank(text) ? text :
                (content != null ? content.getLabel() : ""));
    }

    public void setText(String text) {
        this.text = text;
    }

	public String getUrl() {
        return (content != null ? content.getPermalink() : null);
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public Target getTarget() {
        return target;
    }

    public void setTarget(Target target) {
        this.target = target;
    }



    @Override
    public String getLabel() {
        return getText();
    }

}