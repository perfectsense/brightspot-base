package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.cms.tool.SearchResultSelection;
import com.psddev.cms.tool.SearchResultSelectionGeneratable;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.db.ReferentialText;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StringUtils;
import com.psddev.global.Discoverable;

import java.util.ArrayList;
import java.util.List;

@SearchResultSelectionGeneratable.ItemTypes({Image.class})
@ToolUi.Referenceable
@Renderer.Paths({
        @Renderer.Path(value = "/render/model/gallery-object.jsp"),
        @Renderer.Path(context = "enhancement", value = "/render/modules/embedded-gallery.jsp"),
})
@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
public class Gallery extends Content implements Directory.Item, Discoverable, PromotableContent, SearchResultSelectionGeneratable {

    @Indexed
    private String name;
    private ReferentialText description;
    @Indexed
    private Section section;
    @Required
    private List<Slide> slides;

    @ToolUi.Heading("End Modules")
    private List<FullWidthModule> endModules;


    @Embedded
    @PreviewField("image/file")
    @Recordable.LabelFields("image/name")
    public static class Slide extends Record {

        @ToolUi.BulkUpload
        private Image image;
        private String caption;


        public Image getImage() {
            return image;
        }

        public void setImage(Image image) {
            this.image = image;
        }

        public String getCaption() {
            return caption;
        }

        public void setCaption(String caption) {
            this.caption = caption;
        }

    }

    public List<FullWidthModule> getEndModules() {
        return endModules;
    }

    public void setEndModules(List<FullWidthModule> endModules) {
        this.endModules = endModules;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public ReferentialText getDescription() {
        return description;
    }

    public void setDescription(ReferentialText description) {
        this.description = description;
    }

    public List<Slide> getSlides() {
        return slides;
    }

    public void setSlides(List<Slide> slides) {
        this.slides = slides;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String createPermalink(Site site) {

        if (this.getName() != null) {
            return "/" + StringUtils.toNormalized(name);
        } else {
            return null;
        }
    }

    @Override
    public String getPromoTitleFallback() {
        return getName();
    }

    @Override
    public Image getPromoImageFallback() {
        if (ObjectUtils.isBlank(slides)) {
            return null;
        }

        return getSlides().get(0).getImage();
    }

    public void fromSelection(SearchResultSelection searchResultSelection) {

        List<Slide> slides = new ArrayList<Slide>();

        for (Object object : searchResultSelection.createItemsQuery().selectAll()) {

            if (object instanceof Image) {

                Slide slide = new Slide();
                slide.setImage((Image) object);
                slides.add(slide);
            }
        }

        setSlides(slides);
    }
}

