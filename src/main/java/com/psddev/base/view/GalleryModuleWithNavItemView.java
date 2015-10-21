package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-gallery-module-with-nav-item")
public interface GalleryModuleWithNavItemView {

    String getNavText();

    Object getNavImage();
}
