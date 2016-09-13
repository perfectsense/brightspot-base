package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ColorImage;
import com.psddev.dari.util.StorageItem;

@ToolUi.Publishable(false)
public class Image extends Content implements ColorImage {

    @Required
    private StorageItem file;

    private String caption;

    public StorageItem getFile() {
        return file;
    }

    public void setFile(StorageItem file) {
        this.file = file;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    @Override
    public StorageItem getColorImage() {
        return getFile();
    }
}
