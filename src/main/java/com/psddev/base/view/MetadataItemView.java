package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("common/metadata-item")
public interface MetadataItemView {

    Map<String, String> getAttributes();
}
