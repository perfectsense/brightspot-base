package com.psddev.base.viewmodel;

import java.util.Collection;
import java.util.Objects;
import java.util.stream.Collectors;

import com.psddev.base.view.base.util.ConcatenatedView;

import com.psddev.cms.view.ViewModel;
import com.psddev.dari.db.Recordable;

public abstract class BaseViewModel<M> extends ViewModel<M> {

    protected final <T> Object createBaseView(String viewType, T model) {

        if (model instanceof String || model instanceof Boolean || model instanceof Number) {
            return model;

        } else if (model instanceof Recordable) {
            return createView(viewType, model);

        } else if (model instanceof Collection) {
            return new ConcatenatedView.Builder()
                .addAllToItems(((Collection<?>) model).stream()
                    .map(item -> createBaseView(viewType, item))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList()))
                .build();

        } else {
            return null;
        }
    }
}
