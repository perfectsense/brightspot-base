package com.brightspotbase;

import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.image.HotSpotRegion;

@Recordable.DisplayName("Hotspot")
public class CustomHotspot extends Record implements HotSpotRegion {

    private Link link;

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
    }

    @Override
    public String getLabel() {
        return getLink() != null ? getLink().getText() : null;
    }

}