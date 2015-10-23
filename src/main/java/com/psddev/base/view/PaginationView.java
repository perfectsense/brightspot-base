package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-pagination")
public interface PaginationView {

    Object getPrevious();

    Object getNext();

    List<Object> getListItems();
}
