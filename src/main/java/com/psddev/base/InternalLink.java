package com.psddev.base;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.util.ObjectUtils;

public class InternalLink extends Link {

    @ToolUi.Placeholder(dynamicText = "${content.textDefault}", editable = true, clearOnChange = true)
    private String textOverride;

    @Required
    private Linkable content;

    public String getTextOverride() {
        return textOverride;
    }

    public void setTextOverride(String textOverride) {
        this.textOverride = textOverride;
    }

    public Linkable getContent() {
        return content;
    }

    public void setContent(Linkable content) {
        this.content = content;
    }

    public String getTextDefault() {
        return content != null ? content.getLinkableText() : null;
    }

    @Override
    public String getLinkText() {
        return ObjectUtils.firstNonBlank(getTextOverride(), getTextDefault());
    }

    @Override
    public String getLinkUrl() {
        return content != null ? content.getLinkableUrl() : null;
    }
}
