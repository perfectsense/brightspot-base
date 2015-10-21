package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("common/image")
public interface ImageView {

    Map<String, String> getAttributes();

    String getNavText();
}
