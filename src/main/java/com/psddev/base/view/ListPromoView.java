package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-list-promo")
public interface ListPromoView {

    Object getHeading();

    List<Object> getListItems();

    String getModifierClass();

    Object getCta();

    String getHorizontalSplit();

    Boolean isOrderedList();
}
