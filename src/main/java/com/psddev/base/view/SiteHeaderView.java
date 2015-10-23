package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-site-header")
public interface SiteHeaderView {

    String getSiteName();

    Object getSiteLogo();

    // TYPE ERROR: searchForm

    List<Object> getMainMenu();

    List<Object> getTophat();

    List<Object> getExtraMenu();

    // NAME ERROR: EXAMPLE extraLinks - List

    List<Object> getSharing();
}
