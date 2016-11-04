package com.psddev.base;

import com.psddev.base.rte.ArticleBodyRichTextToolbar;
import com.psddev.base.viewmodel.ArticleViewModel;
import com.psddev.base.viewmodel.PageViewModel;
import com.psddev.base.viewmodel.ViewTypes;
import com.psddev.cms.db.*;
import com.psddev.cms.view.ViewBinding;
import com.psddev.dari.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@ViewBinding(value = PageViewModel.class, types = PageFilter.PAGE_VIEW_TYPE)
@ViewBinding(value = ArticleViewModel.class, types = ViewTypes.BODY)

@Seo.TitleFields("headline")
@Seo.DescriptionFields("subHeadline")
public class Article extends Content implements Directory.Item,
                                                Promotable,
                                                Taggable {

    @Required
    @Indexed
    private String headline;

    @ToolUi.Placeholder(dynamicText = "${content.headlineFallback}", editable = true)
    private String socialHeadline;

    private String subHeadline;

    @Indexed
    private List<Author> authors;

    @ToolUi.RichText(toolbar = ArticleBodyRichTextToolbar.class)
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

    public List<Author> getAuthors() {
        if (authors == null) {
            return new ArrayList<>();
        }
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
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
