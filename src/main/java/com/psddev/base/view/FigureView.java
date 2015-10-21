package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("common/figure")
public interface FigureView {

    String getCredit();

    Object getCaption();

    Object getImage();
}
