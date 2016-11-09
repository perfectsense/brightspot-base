package com.psddev.base;

//TODO: Need more reqs on how SocialLink will display (icon vs text)
public class SocialLink extends ExternalLink {

    private String text;

    private SocialNetworkType socialType;

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
}
