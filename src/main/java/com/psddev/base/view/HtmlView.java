package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("common/html")
public interface HtmlView {

    String getText();

    String getModifierClass();
}
