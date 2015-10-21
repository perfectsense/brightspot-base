package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-bio-social-link")
public interface BioSocialLinkView {

    String getIcon();

    Object getLink();
}
