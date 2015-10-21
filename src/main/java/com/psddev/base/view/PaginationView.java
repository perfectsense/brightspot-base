package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-pagination")
public interface PaginationView {

    // TYPE ERROR: navigate

    List<Object> getListItems();
}
