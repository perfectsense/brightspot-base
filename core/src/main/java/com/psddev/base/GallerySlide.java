package com.psddev.base;

import com.psddev.base.rte.BasicRichTextToolbar;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.StringUtils;

@Recordable.Embedded
@Recordable.PreviewField("image/file")
public class GallerySlide extends Record {

    @ToolUi.Placeholder(dynamicText = "${content.titleFallback}", editable = true)
    private String title;

    @ToolUi.Placeholder(dynamicText = "${content.descriptionFallback}", editable = true)
    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    private String description;

    @Required
    @ToolUi.BulkUpload
    private Image image;

    public String getTitle() {
        if (StringUtils.isBlank(title)) {
            return getTitleFallback();
        }
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        if (StringUtils.isBlank(description)) {
            return getDescriptionFallback();
        }
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public String getTitleFallback() {
        return image == null ? null : image.getTitle();
    }

    public String getDescriptionFallback() {
        return image == null ? null : image.getCaption();
    }

    @Override
    public String getLabel() {
        if (!StringUtils.isBlank(getTitle())) {
            return getTitle();
        }

        if (getImage() != null) {
            return getImage().getLabel();
        }

        return super.getLabel();
    }
}
