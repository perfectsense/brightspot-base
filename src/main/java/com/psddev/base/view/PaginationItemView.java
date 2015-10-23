package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-pagination-item")
public interface PaginationItemView {

    String getModifierClass();

    Object getLink();
}
