package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-bio")
public interface BioView {

    Object getImage();

    String getTitle();

    List<Object> getSubtitles();

    Object getText();

    List<Object> getPrimaryList();

    List<Object> getSecondaryList();

    List<Object> getSocialLinks();

    List<Object> getExtraImages();

    List<Object> getLinks();
}
