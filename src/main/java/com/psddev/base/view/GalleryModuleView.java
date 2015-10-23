package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-gallery-module")
public interface GalleryModuleView {

    Boolean isHorizontalSlides();

    Long getSlidesToShowMedium();

    Long getSlidesToShowSmall();

    Long getSlidesToScrollMedium();

    Long getSlidesToScrollSmall();

    String getTheme();

    Object getGalleryTitle();

    List<Object> getGallerySlides();

    Boolean isDots();

    Object getCta();

    Boolean isDynamicSlideLoad();
}
