package com.psddev.base;

import com.psddev.base.viewmodel.LinkedTextViewModel;
import com.psddev.cms.db.ToolUi;
import com.psddev.cms.view.ViewBinding;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;

import java.util.ArrayList;
import java.util.List;

@Recordable.Embedded
@ViewBinding(LinkedTextViewModel.class)
public abstract class Link extends Record {

    public static final String ADVANCED_TAB = "Advanced";

    @ToolUi.Placeholder("Same Window/Tab")
    @ToolUi.Tab(ADVANCED_TAB)
    private LinkTarget target;

    @ToolUi.Tab(ADVANCED_TAB)
    private List<LinkAttribute> attributes;

    public LinkTarget getTarget() {
        return target;
    }

    public void setTarget(LinkTarget target) {
        this.target = target;
    }

    public List<LinkAttribute> getAttributes() {
        if (attributes == null) {
            attributes = new ArrayList<>();
        }
        return attributes;
    }

    public void setAttributes(List<LinkAttribute> attributes) {
        this.attributes = attributes;
    }

    public abstract String getLinkUrl();

    public String getLinkText() {
        return null;
    }
}
