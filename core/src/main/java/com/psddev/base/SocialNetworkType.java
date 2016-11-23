package com.psddev.base;

public enum SocialNetworkType {

    Facebook("Facebook"),
    Twitter("Twitter"),
    LinkedIn("LinkedIn"),
    YouTube("YouTube"),
    Instagram("Instagram"),
    GooglePlus("Google+"),
    Pinterest("Pinterest"),
    Email("Email"),
    Website("Website");

    private String value;

    SocialNetworkType(String v) {
        value = v;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return getValue();
    }
}
