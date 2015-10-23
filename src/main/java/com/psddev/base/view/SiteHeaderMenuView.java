package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-site-header-menu")
public interface SiteHeaderMenuView {

    Object getHeading();

    List<Object> getItems();
}
