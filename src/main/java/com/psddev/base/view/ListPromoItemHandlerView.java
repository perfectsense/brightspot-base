package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-list-promo-item-handler")
public interface ListPromoItemHandlerView {

    String getImgAlign();

    Object getImage();

    String getName();

    Object getLink();

    Object getTitle();

    String getDescription();

    List<Object> getTags();

    String getSubtitle();
}
