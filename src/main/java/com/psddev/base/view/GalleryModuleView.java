package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-gallery-module")
public interface GalleryModuleView {

    Boolean isHorizontalSlides();

    // TYPE ERROR: slidesToShow

    // TYPE ERROR: slidesToScroll

    String getTheme();

    Object getGalleryTitle();

    List<Object> getGallerySlides();

    Boolean isDots();

    Object getCta();

    Boolean isDynamicSlideLoad();
}
