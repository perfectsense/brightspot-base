package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("layouts/two-col-main-left-aside-right")
public interface TwoColMainLeftAsideRightView {

    List<Object> getAboveColumns();

    List<Object> getMain();

    List<Object> getAside();
}
