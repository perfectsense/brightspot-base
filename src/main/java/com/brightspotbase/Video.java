package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.db.ReferentialText;
import com.psddev.dari.util.StringUtils;

import java.util.List;

@ToolUi.Referenceable
@Recordable.PreviewField("thumbnailImage/file")
@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Paths({
        @Renderer.Path(value = "/render/model/video-object.jsp"),
        @Renderer.Path(context = "enhancement", value = "/render/modules/embedded-video.jsp")
})
public class Video extends Content implements Directory.Item, PromotableContent {

    @Required
    @Indexed
    private String name;
    @ToolUi.NoteHtml("<span data-dynamic-html='Preview: <br/><img src=\"http://img.youtube.com/vi/${content.videoId}/0.jpg\" width=\"109\" height=\"65\" />'></span>")
    private Image thumbnailImage;
    @ToolUi.NoteHtml("<span data-dynamic-html='Preview: <br/><iframe width=\"450\" height=\"260\" src=\"http://www.youtube.com/embed/${content.videoId}\" frameborder=\"0\"></iframe>'</span>")
    private String videoId;
    @Indexed
    private Section section;
    private ReferentialText description;

    @ToolUi.Heading("End Modules")
    private List<FullWidthModule> endModules;

    public ReferentialText getDescription() {
        return description;
    }

    public void setDescription(ReferentialText description) {
        this.description = description;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Image getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(Image thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    public List<FullWidthModule> getEndModules() {
        return endModules;
    }

    public void setEndModules(List<FullWidthModule> endModules) {
        this.endModules = endModules;
    }

    @Override
    public String getPromoTitleFallback() {
        return getName();
    }

    @Override
    public Image getPromoImageFallback() {
        return getThumbnailImage();
    }

    @Override
    public String createPermalink(Site site) {

        if (this.getName() != null) {
            return "/" + StringUtils.toNormalized(name);
        } else {
            return null;
        }
    }
}