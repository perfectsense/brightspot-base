package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-enhancement")
public interface EnhancementView {

    Object getContent();

    String getAlign();
}
