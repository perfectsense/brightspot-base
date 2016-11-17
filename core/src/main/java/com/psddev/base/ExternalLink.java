package com.psddev.base;

import com.psddev.cms.db.ToolUi;

public class ExternalLink extends Link {

    @Required
    @ToolUi.Note("Start all external links with http://")
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String getLinkUrl() {
        return getUrl();
    }
}
