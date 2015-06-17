package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.dari.db.Query;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.PaginatedResult;
import com.psddev.dari.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/model/tag-object.jsp")
public class Tag extends Content implements Taxon, Directory.Item, Branded {

    @Required
    @Indexed
    private String name;
    @ToolUi.OnlyPathed
    @ToolUi.Note("This content is highlighted on the tag page.")
    private Content promotedContent;

    @Indexed
    private Tag parent;

    @Indexed
    @Recordable.JunctionField("parent")
    private List<Tag> children;


    public Tag getParent() {
        return parent;
    }

    public void setParent(Tag parent) {
        this.parent = parent;
    }

    public boolean isRoot() {
        return getParent() == null;
    }

    public List<Tag> getChildren() {
        if (children == null) {
            children = new ArrayList<Tag>();
        }

        return children;
    }

    public void setChildren(List<Tag> children) {
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PaginatedResult<PromotableContent> getTaggedContent(Site site) {
        Query query = Query.from(PromotableContent.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.where("tags = ?", this).select(0, 12);
    }

    @Override
    public String createPermalink(Site site) {

        if (this.getName() != null) {
            return "/tag/" + StringUtils.toNormalized(name);
        } else {
            return null;
        }

    }

    public Content getPromotedContent() {
        return promotedContent;
    }

    public void setPromotedContent(Content promotedContent) {
        this.promotedContent = promotedContent;
    }
}