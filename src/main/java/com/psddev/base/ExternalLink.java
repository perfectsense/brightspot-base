package com.psddev.base;

public class ExternalLink extends Link {

    @Required
    private String text;

    @Required
    private String url;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String getLinkText() {
        return getText();
    }

    @Override
    public String getLinkUrl() {
        return getUrl();
    }
}
