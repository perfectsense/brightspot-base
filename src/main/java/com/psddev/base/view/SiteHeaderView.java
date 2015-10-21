package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-site-header")
public interface SiteHeaderView {

    String getSiteName();

    Object getSiteLogo();

    // TYPE ERROR: searchForm

    // TYPE ERROR: mainMenu

    // TYPE ERROR: EXAMPLE tophat

    List<Object> getExtraMenu();

    // NAME ERROR: EXAMPLE extraLinks - List

    // TYPE ERROR: sharing
}
