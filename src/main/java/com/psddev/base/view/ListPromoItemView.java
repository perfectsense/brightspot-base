package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-list-promo-item")
public interface ListPromoItemView {

    List<Object> getSections();

    String getImgAlign();
}
