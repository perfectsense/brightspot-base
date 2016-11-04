package com.psddev.base.viewmodel;

import java.util.Arrays;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import com.psddev.base.view.base.page.ExternalScriptView;
import com.psddev.base.view.base.page.ExternalStylesheetView;
import com.psddev.base.view.base.page.HeadView;
import com.psddev.cms.db.ElFunctionUtils;
import com.psddev.cms.db.Seo;
import com.psddev.cms.view.ViewModel;
import com.psddev.dari.db.Recordable;

public class HeadViewModel extends ViewModel<Recordable> implements HeadView {

    @Override
    public Object getTitle() {
        return model.as(Seo.ObjectModification.class).findTitle();
    }

    @Override
    public Object getDescription() {
        return model.as(Seo.ObjectModification.class).findDescription();
    }

    @Override
    public Object getKeywords() {
        // Grab the first 10 keywords, per google recommendation
        Set<String> keywords = model.as(Seo.ObjectModification.class).findKeywords();
        return keywords != null ? keywords.stream().limit(10).collect(Collectors.joining(",")) : null;
    }

    @Override
    public Collection<?> getItems() {
        return Arrays.asList(
            new ExternalStylesheetView.Builder()
                .rel("stylesheet")
                .type("text/css")
                .href(ElFunctionUtils.resource("/All.min.css"))
                .build(),
            new ExternalScriptView.Builder()
                .type("text/javascript")
                .src(ElFunctionUtils.resource("/main.min.js"))
                .build());
    }
}
