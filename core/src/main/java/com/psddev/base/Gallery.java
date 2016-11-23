package com.psddev.base;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.psddev.base.viewmodel.PageViewModel;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.Directory;
import com.psddev.cms.db.PageFilter;
import com.psddev.cms.db.Seo;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;
import com.psddev.cms.view.ViewBinding;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.StorageItem;
import com.psddev.dari.util.StringUtils;

@ViewBinding(value = PageViewModel.class, types = PageFilter.PAGE_VIEW_TYPE)

@Seo.TitleFields("headline")
@Seo.DescriptionFields("subHeadline")
@Recordable.PreviewField("getPreviewFile")
public class Gallery extends Content implements BylineAssignable,
                                                Directory.Item,
                                                Linkable,
                                                Promotable,
                                                Taggable {

    @Required
    @Indexed
    private String headline;

    @ToolUi.Placeholder(dynamicText = "${content.headline}", editable = true)
    private String socialHeadline;

    private String subHeadline;

    @Required
    private List<GallerySlide> slides;

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSocialHeadline() {
        return socialHeadline;
    }

    public void setSocialHeadline(String socialHeadline) {
        this.socialHeadline = socialHeadline;
    }

    public String getSubHeadline() {
        return subHeadline;
    }

    public void setSubHeadline(String subHeadline) {
        this.subHeadline = subHeadline;
    }

    public List<GallerySlide> getSlides() {
        if (slides == null) {
            slides = new ArrayList<>();
        }
        return slides;
    }

    public void setSlides(List<GallerySlide> slides) {
        this.slides = slides;
    }

    /**
     * Not for public use.
     *
     * Retrieves {@link StorageItem} of first {@link StorageItem} present in {@link #slides}.
     *
     * @return May be {@code null}.
     */
    @Ignored(false)
    @ToolUi.Hidden
    public StorageItem getPreviewFile() {

        Optional<StorageItem> optional = getSlides()
                .stream()
                .map(GallerySlide::getImage)
                .filter(Objects::nonNull)
                .map(Image::getFile)
                .filter(Objects::nonNull)
                .findFirst();

        return optional.isPresent() ? optional.get() : null;
    }

    @Override
    public String createPermalink(Site site) {
        return StringUtils.toNormalized(headline);
    }
}
