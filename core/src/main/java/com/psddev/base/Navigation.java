package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.base.rte.BasicRichTextToolbar;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;

public class Navigation extends Content {

    @Required
    private String name;

    @DisplayName("Main Navigation")
    @Embedded
    private List<NavigationItem> mainNavLinks;

    private List<SocialLink> socialLinks;

    @ToolUi.Note("If populated, displays above the main navigation links")
    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    private String hat;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<NavigationItem> getMainNavLinks() {
        if (mainNavLinks == null) {
            mainNavLinks = new ArrayList<>();
        }
        return mainNavLinks;
    }

    public void setMainNavLinks(List<NavigationItem> mainNavLinks) {
        this.mainNavLinks = mainNavLinks;
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

    public String getHat() {
        return hat;
    }

    public void setHat(String hat) {
        this.hat = hat;
    }
}
