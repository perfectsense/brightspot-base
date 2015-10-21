package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-gallery-fullscreen")
public interface GalleryFullscreenView {

    Boolean isGalleryThumbnails();

    Boolean isDynamicSlideLoad();

    String getGalleryTitle();

    List<Object> getGallerySlides();

    Object getSharing();

    Object getGalleryDescription();

    Object getTags();
}
