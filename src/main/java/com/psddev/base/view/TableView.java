package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-table")
public interface TableView {

    // TYPE ERROR: title

    List<Object> getHeadings();

    List<Object> getRows();

    String getTheme();

    String getTextAlignment();

    String getVerticalAlignment();

    Boolean isFullWidth();

    Boolean isFixedColWidth();

    Boolean isVerticalStripes();

    Boolean isHorizontalStripes();

    Boolean isSort();

    String getModifierClass();
}
