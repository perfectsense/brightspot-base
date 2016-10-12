package com.psddev.base;

import com.psddev.cms.db.ToolUi;

public class ContentLink extends Link {

    @Required
    @ToolUi.OnlyPathed
    private Linkable content;

    public Linkable getContent() {
        return content;
    }

    public void setContent(Linkable content) {
        this.content = content;
    }

    @Override
    public String getLinkUrl() {
        Linkable content = getContent();
        return content != null ? content.getLinkableUrl() : null;
    }

    @Override
    public String getLinkText() {
        Linkable content = getContent();
        return content != null ? content.getLinkableText() : super.getLinkText();
    }
}
