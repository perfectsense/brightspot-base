package com.psddev.base.viewmodel;

import com.psddev.base.view.styleguide.util.HeadView;
import com.psddev.base.view.styleguide.util.PageView;
import com.psddev.cms.view.ViewModel;
import com.psddev.dari.db.Recordable;

public class PageViewModel extends ViewModel<Recordable> implements PageView {

    @Override
    public HeadView getHead() {
        return createView(HeadViewModel.class, model);
    }

    @Override
    public Object getBody() {
        return createView(PageView.BODY_ELEMENT, model);
    }
}
