package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-gallery-module-with-nav")
public interface GalleryModuleWithNavView {

    Boolean isTextNav();

    Object getGalleryTitle();

    List<Object> getGallerySlides();

    List<Object> getGalleryNavItems();

    String getThumbnailsToShow();
}
