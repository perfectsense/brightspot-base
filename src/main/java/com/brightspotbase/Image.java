package com.brightspotbase;


import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ColorImage;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StorageItem;
import com.psddev.dari.util.StringUtils;
import com.psddev.image.HotSpots;

import java.util.List;
import java.util.Map;

@ToolUi.Referenceable
@Renderer.Path("/render/common/image.jsp")
@Recordable.PreviewField("file")
public class Image extends Content implements ColorImage, HotSpots {

    @Indexed
    @Required
    private String name;
    @Required
    private StorageItem file;
    @ToolUi.Placeholder(dynamicText = "${content.name}", editable = true)
    private String altText;
    private String caption;
    private String credit;
    @Indexed
    private List<Tag> tags;

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public String getCredit(){
        return credit;
    }
    
    public void setCredit(String credit){
        this.credit = credit;
    }
    @Override
    public StorageItem getColorImage() {
        return file;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public StorageItem getFile() {
        return file;
    }

    public void setFile(StorageItem file) {
        this.file = file;
    }


    public String getUrl() {
        if (file != null && file.getPublicUrl() != null) {
            return file.getPublicUrl().toString();
        } else {
            return null;
        }

    }

    @Override
    public void beforeSave() {
        if (StringUtils.isBlank(name)) {
            if (file != null) {
                Map<String, Object> metadata = file.getMetadata();
                if (!ObjectUtils.isBlank(metadata)) {
                    String fileName = (String) metadata.get("originalFilename");
                    if (!StringUtils.isEmpty(fileName)) {
                        name = fileName;
                    }
                }
            }
        }
    }

}
