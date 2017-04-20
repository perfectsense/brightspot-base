package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Taxon;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Recordable;

import java.util.ArrayList;
import java.util.List;

@ToolUi.Publishable(false)
public class Tag extends Content implements Taxon {

    @Required
    @Indexed
    private String title;

    @Indexed
    private Tag parent;

    @Indexed
    @Recordable.JunctionField("parent")
    private List<Tag> children;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Tag getParent() {
        return parent;
    }

    public void setParent(Tag parent) {
        this.parent = parent;
    }

    public void setChildren(List<Tag> children) {
        this.children = children;
    }

    @Override
    public boolean isRoot() {
        return getParent() == null;
    }

    @Override
    public List<Tag> getChildren() {
        if (children == null) {
            children = new ArrayList<>();
        }
        return children;
    }
}
