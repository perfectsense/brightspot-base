package com.psddev.base.viewmodel;

import com.psddev.base.Author;
import com.psddev.base.view.base.AuthorView;
import com.psddev.cms.view.ViewModel;

public class AuthorViewModel extends ViewModel<Author> implements AuthorView {

    @Override
    public Object getAffiliation() {
        return null;
    }

    @Override
    public Object getImage() {
        return null;
    }

    @Override
    public Object getName() {
        return model.getName();
    }
}
