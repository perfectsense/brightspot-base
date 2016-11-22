package com.psddev.base.viewmodel;

import com.psddev.base.Link;
import com.psddev.base.LinkTarget;
import com.psddev.base.LinkedText;
import com.psddev.base.view.styleguide.LinkView;
import com.psddev.cms.view.ViewModel;

public class LinkedTextViewModel extends ViewModel<LinkedText> implements LinkView {

    @Override
    public String getBody() {
        return model.getText();
    }

    @Override
    public String getHref() {
        Link link = model.getLink();
        return link != null ? link.getLinkUrl() : null;
    }

    @Override
    public String getTarget() {
        Link link = model.getLink();

        if (link != null) {
            LinkTarget target = link.getTarget();

            if (target != null) {
                return target.getValue();
            }
        }

        return null;
    }
}
