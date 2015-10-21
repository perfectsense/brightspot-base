package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("layouts/two-col-main-left-fixed-right")
public interface TwoColMainLeftFixedRightView {

    List<Object> getMain();

    List<Object> getAside();
}
