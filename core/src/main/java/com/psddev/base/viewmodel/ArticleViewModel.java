package com.psddev.base.viewmodel;

import java.text.SimpleDateFormat;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import com.psddev.base.Article;
import com.psddev.base.rte.RichTextProcessor;
import com.psddev.base.view.base.main.ArticleMainView;
import com.psddev.base.view.base.util.ConcatenatedView;
import com.psddev.base.view.base.util.HtmlElementWrapperView;
import com.psddev.base.view.base.util.RawHtmlView;
import com.psddev.cms.view.ViewModel;

public class ArticleViewModel extends BaseViewModel<Article> implements ArticleMainView {

    private static SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss+00:00");

    @Override
    public Object getBody() {
        return new ConcatenatedView.Builder()
            .addAllToItems(RichTextProcessor.createDefault(model.getBody())
                .renderUnhandledRichTextElements(false)
                .htmlViewFunction((String html) -> new RawHtmlView.Builder().html(html).build())
                .richTextElementViewFunction(rte -> createBaseView(RichTextProcessor.RICH_TEXT_ELEMENT_VIEW_TYPE, rte))
                .htmlElementWrapperViewFunction((element, objects) -> new HtmlElementWrapperView.Builder()
                    .tagName(element.getTagName())
                    .extraAttributes(new LinkedHashMap<>(element.getAttributes()))
                    .body(new ConcatenatedView.Builder()
                        .addAllToItems(objects)
                        .build())
                    .build())
                .build())
            .build();
    }

    @Override
    public Object getBreadcrumbs() {
        return null;
    }

    @Override
    public Object getByline() {
        return new ConcatenatedView.Builder()
            .delimiter(", ")
            .items(model.getAuthors().stream()
                .map(author -> createView(AuthorViewModel.class, author))
                .collect(Collectors.toList()))
            .build();
    }

    @Override
    public Object getComments() {
        return null;
    }

    @Override
    public Object getDateModified() {
        if (model.getUpdateDate() != null) {
            return sf.format(model.getUpdateDate());
        }
        return null;
    }

    @Override
    public Object getDatePublished() {
        if (model.getPublishDate() != null) {
            return sf.format(model.getPublishDate());
        }
        return null;
    }

    @Override
    public Object getHeadline() {
        return model.getHeadline();
    }

    @Override
    public Object getLead() {
        return null;
    }

    @Override
    public Object getPreHeadline() {
        return null;
    }

    @Override
    public Object getSharebar() {
        return null;
    }

    @Override
    public Object getSubHeadline() {
        return model.getSubHeadline();
    }

    @Override
    public Object getTags() {
        return null;
    }
}
