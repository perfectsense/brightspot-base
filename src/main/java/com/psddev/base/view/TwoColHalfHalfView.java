package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("layouts/two-col-half-half")
public interface TwoColHalfHalfView {

    List<Object> getFirst();

    List<Object> getSecond();
}
