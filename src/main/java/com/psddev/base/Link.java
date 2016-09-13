package com.psddev.base;

import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;

@Recordable.Embedded
public abstract class Link extends Record {

    public abstract String getLinkText();

    public abstract String getLinkUrl();
}
