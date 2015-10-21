package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-gallery-fullscreen-slide")
public interface GalleryFullscreenSlideView {

    Object getImage();

    List<Object> getCaption();

    Object getThumbnail();

    Object getSeoLink();
}
