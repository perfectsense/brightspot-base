package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("elements/list")
public interface ListView {

    List<Object> getItems();

    Boolean isInline();

    Boolean isOrdered();

    String getType();

    Boolean isUnstyled();
}
