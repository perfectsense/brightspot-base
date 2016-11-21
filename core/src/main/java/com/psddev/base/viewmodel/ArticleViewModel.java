package com.psddev.base.viewmodel;

import java.text.SimpleDateFormat;

import com.psddev.base.Article;
import com.psddev.base.view.styleguide.BreadcrumbsView;
import com.psddev.base.view.styleguide.ImageView;
import com.psddev.base.view.styleguide.main.ArticleMainView;
import com.psddev.base.view.styleguide.util.ConcatenatedView;

import com.psddev.cms.view.ViewModel;

public class ArticleViewModel extends ViewModel<Article> implements ArticleMainView {

    private static SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss+00:00");

    @Override
    public String getDatePublished() {
        if (model.getPublishDate() != null) {
            return sf.format(model.getPublishDate());
        }
        return null;
    }

    @Override
    public String getPreHeadline() {
        return null;
    }

    @Override
    public String getComments() {
        return null;
    }

    @Override
    public String getSubHeadline() {
        return model.getSubHeadline();
    }

    @Override
    public String getDateModified() {
        if (model.getUpdateDate() != null) {
            return sf.format(model.getUpdateDate());
        }
        return null;
    }

    @Override
    public ConcatenatedView getBody() {
        return null;
    }

    @Override
    public String getHeadline() {
        return model.getHeadline();
    }

    @Override
    public ConcatenatedView getByline() {
        return null;
    }

    @Override
    public BreadcrumbsView getBreadcrumbs() {
        return null;
    }

    @Override
    public ImageView getLead() {
        return null;
    }

    @Override
    public String getTags() {
        return null;
    }

    @Override
    public String getSharebar() {
        return null;
    }
}
