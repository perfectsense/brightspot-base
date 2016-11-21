package com.psddev.base.viewmodel;

import com.psddev.base.view.styleguide.util.HeadView;
import com.psddev.base.view.styleguide.util.PageView;
import com.psddev.base.view.styleguide.util.PageViewBodyField;
import com.psddev.cms.view.ViewModel;
import com.psddev.dari.db.Recordable;

public class PageViewModel extends ViewModel<Recordable> implements PageView {

    @Override
    public HeadView getHead() {
        return createView(HeadView.class, model);
    }

    @Override
    public PageViewBodyField getBody() {
        return createView(PageViewBodyField.class, model);
    }
}
