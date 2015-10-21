package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-site-header-extra-menu-item")
public interface SiteHeaderExtraMenuItemView {

    Object getLink();

    List<Object> getSubMenu();
}
