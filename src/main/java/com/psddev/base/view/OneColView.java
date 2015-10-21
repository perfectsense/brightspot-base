package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("layouts/one-col")
public interface OneColView {

    List<Object> getMain();
}
