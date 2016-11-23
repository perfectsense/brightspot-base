package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.base.rte.BodyRichTextToolbar;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.Directory;
import com.psddev.cms.db.Seo;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.StringUtils;

@Recordable.DisplayName("One-Off Page")
@Seo.TitleFields("headline")
@Seo.DescriptionFields("subHeadline")
public class OneOffPage extends Content implements Directory.Item,
                                                   Linkable {
    @Indexed
    @Required
    private String headline;

    private String subHeadline;

    @ToolUi.RichText(toolbar = BodyRichTextToolbar.class)
    private String body;

    @Embedded
    private List<Module> modules;

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSubHeadline() {
        return subHeadline;
    }

    public void setSubHeadline(String subHeadline) {
        this.subHeadline = subHeadline;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<Module> getModules() {
        if (modules == null) {
            modules = new ArrayList<>();
        }
        return modules;
    }

    public void setModules(List<Module> modules) {
        this.modules = modules;
    }

    @Override
    public String createPermalink(Site site) {
        return StringUtils.toNormalized(headline);
    }
}
