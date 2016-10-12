package com.psddev.base;

import com.psddev.cms.db.Directory;
import com.psddev.dari.db.Recordable;

public interface Linkable extends Recordable {

    default String getLinkableUrl() {
        return getState().as(Directory.ObjectModification.class).getPermalink();
    }

    default String getLinkableText() {
        return getState().getLabel();
    }
}
