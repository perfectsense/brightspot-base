package com.psddev.base.viewmodel;

import java.text.SimpleDateFormat;

import com.psddev.base.Article;
import com.psddev.base.view.BreadcrumbsView;
import com.psddev.base.view.block.util.ImageView;
import com.psddev.base.view.main.article_main.ArticleMainView;
import com.psddev.base.view.block.util.ConcatenatedView;

public class ArticleViewModel extends BaseViewModel<Article> implements ArticleMainView {

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
