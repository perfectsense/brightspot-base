package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-tabber")
public interface TabberView {

    String getHeading();

    List<Object> getTabs();

    Object getCta();
}
