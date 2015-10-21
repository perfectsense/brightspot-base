package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-video-player")
public interface VideoPlayerView {

    Object getTitle();

    Object getDescription();

    Object getVideo();

    Object getTagsTitle();

    List<Object> getTags();

    Object getSharing();
}
