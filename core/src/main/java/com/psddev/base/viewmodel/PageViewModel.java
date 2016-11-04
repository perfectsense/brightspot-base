package com.psddev.base.viewmodel;

import com.psddev.base.view.base.page.PageView;
import com.psddev.dari.db.Recordable;

public class PageViewModel extends StandardViewModel<Recordable> implements PageView {

    @Override
    public Object getHead() {
        return createView(HeadViewModel.class, model);
    }

    @Override
    public Object getBody() {
        return createView(PageView.BODY_ELEMENT, model);
    }
}
