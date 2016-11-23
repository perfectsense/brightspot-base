package com.psddev.base;

import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.StringUtils;

@Recordable.Embedded
public class SocialLink extends Record {

    @Required
    @Embedded
    private ExternalLink externalLink;

    private String text;

    @Required
    private SocialNetworkType socialType;

    public ExternalLink getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(ExternalLink externalLink) {
        this.externalLink = externalLink;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public SocialNetworkType getSocialType() {
        return socialType;
    }

    public void setSocialType(SocialNetworkType socialType) {
        this.socialType = socialType;
    }

    @Override
    public String getLabel() {
        if (!StringUtils.isBlank(getText())) {
            return getText();
        }

        if (getSocialType() != null) {
            return getSocialType().getValue();
        }

        return super.getLabel();
    }
}
