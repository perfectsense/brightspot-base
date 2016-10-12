package com.psddev.base;

public class ExternalLink extends Link {

    @Required
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
