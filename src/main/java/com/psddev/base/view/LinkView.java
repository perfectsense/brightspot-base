package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("common/link")
public interface LinkView {

    Map<String, String> getAttributes();

    Object getBody();

    String getCssClass();

    String getIcon();
}
