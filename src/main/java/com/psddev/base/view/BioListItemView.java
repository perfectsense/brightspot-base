package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-bio-list-item")
public interface BioListItemView {

    String getHeading();

    String getText();
}
