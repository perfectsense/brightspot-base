package com.psddev.base.viewmodel;

import com.psddev.base.Author;
import com.psddev.base.view.styleguide.block.author.AuthorView;
import com.psddev.base.view.styleguide.block.util.ImageView;
import com.psddev.cms.view.ViewModel;

public class AuthorViewModel extends ViewModel<Author> implements AuthorView {

    @Override
    public String getAffiliation() {
        return null;
    }

    @Override
    public ImageView getImage() {
        return null;
    }

    @Override
    public String getName() {
        return model.getName();
    }
}
