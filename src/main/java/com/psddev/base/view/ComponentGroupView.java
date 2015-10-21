package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-component-group")
public interface ComponentGroupView {

    List<Object> getComponents();
}
