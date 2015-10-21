package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-image-promo-image")
public interface ImagePromoImageView {

    Object getImage();

    Object getRolloverImage();

    Object getRolloverText();

    List<Object> getPromoLinks();
}
