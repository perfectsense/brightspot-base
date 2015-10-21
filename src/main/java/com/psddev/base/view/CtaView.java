package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-cta")
public interface CtaView {

    String getLocation();

    Object getContent();
}
