package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.crosslinker.db.Crosslinkable;
import com.psddev.dari.db.ReferentialText;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StringUtils;
import com.psddev.global.Discoverable;
import com.psddev.social.UserGeneratedContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;


@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/model/story-object.jsp")
@Crosslinkable.SimulationName("Default")
public class Story extends Content implements Directory.Item, Crosslinkable, Discoverable, OpenGraph, PromotableContent, UserGeneratedContent {

    private static final Logger LOGGER = LoggerFactory.getLogger(Story.class);

    @Required
    @Indexed
    private String headline;
    private Image leadImage;
    @Indexed
    private Author author;
    @Indexed
    private Section section;
    @Crosslinked
    private ReferentialText body;
    private Link originalContent;
    private String originalSource;

    private ReferentialText perspectiveText;

    @ToolUi.Heading("End Modules")
    private List<FullWidthModule> endModules;

    public ReferentialText getPerspectiveText() {
        return perspectiveText;
    }

    public void setPerspectiveText(ReferentialText perspectiveText) {
        this.perspectiveText = perspectiveText;
    }

    public ReferentialText getBody() {
        return body;
    }

    public void setBody(ReferentialText body) {
        this.body = body;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Image getLeadImage() {
        return leadImage;
    }

    public void setLeadImage(Image leadImage) {
        this.leadImage = leadImage;
    }

    public Link getOriginalContent() {
        return originalContent;
    }

    public void setOriginalContent(Link originalContent) {
        this.originalContent = originalContent;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public List<FullWidthModule> getEndModules() {
        return endModules;
    }

    public void setEndModules(List<FullWidthModule> endModules) {
        this.endModules = endModules;
    }

    public String getOriginalSource() {
        return originalSource;
    }

    public void setOriginalSource(String originalSource) {
        this.originalSource = originalSource;
    }

    @Override
    public String getPromoTitleFallback() {
        return getHeadline();
    }

    @Override
    public Image getPromoImageFallback() {
        return getLeadImage();
    }

    @Override
    public String createPermalink(Site site) {

        Section section = this.getSection();
        if (!ObjectUtils.isBlank(section)) {
            return "/" + StringUtils.toNormalized(section.getName()) + "/" + StringUtils.toNormalized(headline);
        } else {
            return StringUtils.toNormalized(headline);
        }
    }
}