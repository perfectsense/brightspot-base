package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-tags")
public interface TagsView {

    List<Object> getTagList();

    Object getTitle();
}
