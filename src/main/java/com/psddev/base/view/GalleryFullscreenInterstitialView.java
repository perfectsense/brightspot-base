package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("components/bsp-gallery-fullscreen-interstitial")
public interface GalleryFullscreenInterstitialView {

    String getModifierClass();

    Map<String, String> getOptions();
}
