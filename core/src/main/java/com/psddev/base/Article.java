package com.psddev.base;

import com.psddev.base.rte.BodyRichTextToolbar;
import com.psddev.base.viewmodel.ArticleViewModel;
import com.psddev.base.viewmodel.PageViewModel;
import com.psddev.cms.db.Content;
import com.psddev.cms.db.Directory;
import com.psddev.cms.db.PageFilter;
import com.psddev.cms.db.Seo;
import com.psddev.cms.db.Site;
import com.psddev.cms.db.ToolUi;
import com.psddev.cms.view.ViewBinding;
import com.psddev.dari.util.StringUtils;

@ViewBinding(value = PageViewModel.class, types = PageFilter.PAGE_VIEW_TYPE)
@ViewBinding(value = ArticleViewModel.class, types = "body")

@Seo.TitleFields("headline")
@Seo.DescriptionFields("subHeadline")
@Seo.OpenGraphType("article")
public class Article extends Content implements BylineAssignable,
                                                Directory.Item,
                                                Linkable,
                                                Promotable,
                                                Taggable {

    @Required
    @Indexed
    private String headline;

    @ToolUi.Placeholder(dynamicText = "${content.headlineFallback}", editable = true)
    private String socialHeadline;

    private String subHeadline;

    @ToolUi.RichText(toolbar = BodyRichTextToolbar.class)
    private String body;

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

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getHeadlineFallback() {
        if (headline != null) {
            return headline;
        }
        return null;
    }

    @Override
    public String createPermalink(Site site) {
        return StringUtils.toNormalized(headline);
    }
}
