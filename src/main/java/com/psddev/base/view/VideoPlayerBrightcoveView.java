package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-video-player-brightcove")
public interface VideoPlayerBrightcoveView {

    String getId();

    String getPlayerId();

    String getBgHex();

    String getPlayerKey();
}
