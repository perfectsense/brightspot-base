package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("common/body")
public interface BodyView {

    Object getHeaderView();

    Object getMainView();

    Object getFooterView();
}
