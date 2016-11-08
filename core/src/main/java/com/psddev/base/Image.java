package com.psddev.base;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.psddev.base.rte.BasicRichTextToolbar;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ColorImage;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StorageItem;

@Recordable.PreviewField("file")
@ToolUi.Publishable(false)
public class Image extends Content implements ColorImage,
                                              Taggable {

    @Required
    @Indexed
    @ToolUi.Placeholder(dynamicText = "${content.titleFallback}", editable = true)
    private String title;

    @Required
    private StorageItem file;

    @ToolUi.Placeholder(dynamicText = "${content.altFallback}", editable = true)
    private String altText;

    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    @ToolUi.Placeholder(dynamicText = "${content.captionFallback}", editable = true)
    private String caption;

    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    @ToolUi.Placeholder(dynamicText = "${content.creditFallback}", editable = true)
    private String credit;

    @ToolUi.Placeholder(dynamicText = "${content.sourceFallback}", editable = true)
    private String source;

    @ToolUi.Placeholder(dynamicText = "${content.copyrightFallback}", editable = true)
    private String copyrightNotice;

    private Date dateTaken;

    @ToolUi.ReadOnly
    private Integer imageWidth;

    @ToolUi.ReadOnly
    private Integer imageHeight;

    private Set<String> keywords;

    public String getTitle() {
        if (title == null) {
            return getTitleFallback();
        }
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public StorageItem getFile() {
        return file;
    }

    public void setFile(StorageItem file) {
        this.file = file;
    }

    public String getCaption() {
        if (caption == null) {
            return getCaptionFallback();
        }
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getCredit() {
        if (credit == null) {
            return getCreditFallback();
        }
        return credit;
    }

    public void setCredit(String credit) {
        this.credit = credit;
    }

    public String getAltText() {
        if (altText == null) {
            return getAltFallback();
        }
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getCopyrightNotice() {
        if (copyrightNotice == null) {
            return getCopyrightFallback();
        }
        return copyrightNotice;
    }

    public void setCopyrightNotice(String copyrightNotice) {
        this.copyrightNotice = copyrightNotice;
    }

    public String getSource() {
        if (source == null) {
            return getSourceFallback();
        }
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Date getDateTaken() {
        return dateTaken;
    }

    public void setDateTaken(Date dateTaken) {
        this.dateTaken = dateTaken;
    }

    public Integer getImageWidth() {
        return imageWidth;
    }

    public void setImageWidth(Integer imageWidth) {
        this.imageWidth = imageWidth;
    }

    public Integer getImageHeight() {
        return imageHeight;
    }

    public void setImageHeight(Integer imageHeight) {
        this.imageHeight = imageHeight;
    }

    public Set<String> getKeywords() {
        if (keywords == null) {
            return new HashSet<>();
        }
        return keywords;
    }

    public void setKeywords(Set<String> keywords) {
        this.keywords = keywords;
    }

    public StorageItemImageMetadata getFileMetadata() {
        return new StorageItemImageMetadata(getFile());
    }

    // --- ColorImage support ---

    @Override
    public StorageItem getColorImage() {
        return getFile();
    }

    // --- Private Helpers ---

    /** Not for external use! */
    public String getTitleFallback() {
        return ObjectUtils.firstNonBlank(
            getFileMetadata().getTitle(),
            getFileMetadata().getOriginalFileName(),
            getFileNameFromStoragePath());
    }

    /** Not for external use! */
    public String getCaptionFallback() {
        return getFileMetadata().getCaption();
    }

    /** Not for external use! */
    public String getCreditFallback() {
        String byline = getFileMetadata().getByline();
        String source = getFileMetadata().getCredit();

        if (byline != null) {
            if (source != null) {
                return byline + "/" + source;

            } else {
                return byline;
            }
        } else {
            return source;
        }
    }

    /** Not for external use! */
    public String getSourceFallback() {
        return getFileMetadata().getSource();
    }

    /** Not for external use! */
    public String getCopyrightFallback() {
        return getFileMetadata().getCopyrightNotice();
    }

    /** Not for external use! */
    public String getAltFallback() {
        return getTitle();
    }

    private Date getDateTakenFallback() {

        Date dateTaken = getFileMetadata().getDateTaken();

        // fallback to publish date
        if (dateTaken == null) {
            Date publishDate = as(ObjectModification.class).getPublishDate();
            if (publishDate != null) {
                dateTaken = publishDate;
            }
        }

        return dateTaken;
    }

    @ToolUi.Hidden
    @Indexed(unique = true)
    public String getFileNameFromStoragePath() {

        StorageItem file = getFile();
        if (file != null) {

            String path = file.getPath();
            if (path != null) {

                int lastSlashAt = path.lastIndexOf('/');
                if (lastSlashAt >= 0) {
                    return path.substring(lastSlashAt + 1);
                } else {
                    return path;
                }
            }
        }
        return null;
    }

    @Override
    protected void beforeSave() {
        if (file != null) {
            if (dateTaken == null) {
                setDateTaken(getDateTakenFallback());
            }
            if (getKeywords().isEmpty()) {
                getKeywords().addAll(getFileMetadata().getKeywords());
            }

            setImageWidth(getFileMetadata().getWidth());
            setImageHeight(getFileMetadata().getHeight());
        }

        if (title == null) {
            setTitle(getTitle());
        }
    }
}
