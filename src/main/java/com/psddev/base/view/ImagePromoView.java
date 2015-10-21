package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-image-promo")
public interface ImagePromoView {

    String getHeading();

    List<Object> getImages();

    String getHorizontalSplit();

    Object getCta();
}
