package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-article")
public interface ArticleView {

    Object getSharing();

    String getPermalink();

    String getPublishDate();

    String getTitle();

    // NAME ERROR: EXAMPLE subTitle - String

    List<Object> getAuthors();

    Object getTags();

    Object getLeadImage();

    List<Object> getBody();

    String getSubTitle();

    Object getLead();
}
