package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.base.rte.BasicRichTextToolbar;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.Directory;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;

public abstract class Person extends Content implements Directory.Item {

    @Required
    @Indexed
    private String name;

    private Image image;

    @DisplayName("Full Biography")
    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    private String fullBio;

    @DisplayName("Short Biography")
    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    private String shortBio;

    private List<SocialLink> socialLinks;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public String getFullBio() {
        return fullBio;
    }

    public void setFullBio(String fullBio) {
        this.fullBio = fullBio;
    }

    public String getShortBio() {
        return shortBio;
    }

    public void setShortBio(String shortBio) {
        this.shortBio = shortBio;
    }

    public List<SocialLink> getSocialLinks() {
        if (socialLinks == null) {
            socialLinks = new ArrayList<>();
        }
        return socialLinks;
    }

    public void setSocialLinks(List<SocialLink> socialLinks) {
        this.socialLinks = socialLinks;
    }

    @Override
    public String createPermalink(Site site) {
        return null;
    }
}
