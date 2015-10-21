package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-social-share")
public interface SocialShareView {

    Boolean isMonochrome();

    String getTitle();

    String getDescription();

    Long getFacebookId();

    String getIconClass();

    String getImage();

    String getUrl();

    String getRedirectUrl();

    List<Object> getServices();

    String getSocial();
}
