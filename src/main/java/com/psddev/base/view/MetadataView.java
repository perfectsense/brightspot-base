package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("common/metadata")
public interface MetadataView {

    String getTitle();

    String getCanonicalUrl();

    List<Object> getMetadata();
}
