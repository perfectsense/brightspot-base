package com.psddev.base;

import com.psddev.dari.db.Recordable;

public interface Linkable extends Recordable {

    default String getLinkableText() {
        return getState().getLabel();
    }

    default String getLinkableUrl() {
        return null;
    }
}
