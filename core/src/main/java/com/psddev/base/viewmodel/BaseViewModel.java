package com.psddev.base.viewmodel;

import com.psddev.cms.view.ViewModel;
import com.psddev.dari.db.Recordable;

public abstract class BaseViewModel<M> extends ViewModel<M> {

    protected final <T> Object createBaseView(String viewType, T model) {

        if (model instanceof String || model instanceof Boolean || model instanceof Number) {
            return model;

        } else if (model instanceof Recordable) {
            return createView(viewType, model);

        } else {
            return null;
        }
    }
}
