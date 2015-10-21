package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-table-row")
public interface TableRowView {

    List<Object> getColumns();
}
