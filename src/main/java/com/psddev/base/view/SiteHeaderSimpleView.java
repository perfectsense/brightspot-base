package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-site-header-simple")
public interface SiteHeaderSimpleView {

    String getSiteName();

    Object getSiteLogo();

    List<Object> getNavLinks();
}
