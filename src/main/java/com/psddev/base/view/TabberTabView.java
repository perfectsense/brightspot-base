package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-tabber-tab")
public interface TabberTabView {

    String getLabel();

    String getLabelSubText();

    Object getComponent();

    String getTextHeading();

    String getText();
}
