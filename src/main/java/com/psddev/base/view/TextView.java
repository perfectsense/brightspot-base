package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("common/text")
public interface TextView {

    String getText();

    String getModifierClass();
}
