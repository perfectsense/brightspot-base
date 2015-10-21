package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("layouts/three-col-thirds")
public interface ThreeColThirdsView {

    List<Object> getAboveColumns();

    List<Object> getFirst();

    List<Object> getSecond();

    List<Object> getThird();
}
