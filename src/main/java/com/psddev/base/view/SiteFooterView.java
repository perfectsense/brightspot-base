package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-site-footer")
public interface SiteFooterView {

    // TYPE ERROR: firstCol

    // TYPE ERROR: secondCol

    // TYPE ERROR: thirdCol

    String getDisclaimer();

    String getPrefix();

    Object getLogo();
}
