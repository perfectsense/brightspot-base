package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.PaginatedResult;
import com.psddev.dari.util.StringUtils;

import java.util.List;

@Renderer.Path("/render/model/section-object.jsp")
@Renderer.LayoutPath("/render/common/page-container.jsp")
@ToolUi.GlobalFilter
public class Section extends Content implements Directory.Item, Branded {

    @Required
    @Indexed(unique = true)
    private String name;
    @Embedded
    private List<FullWidthModule> modules;

    public List<FullWidthModule> getModules() {
        return modules;
    }

    public void setModules(List<FullWidthModule> modules) {
        this.modules = modules;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public PaginatedResult<Story> getStories(Site site) {
        Query query = Query.from(Story.class);
        if (site != null) {
            query.where(site.itemsPredicate());
        }
        return query.where("section = ?", this).select(0, 12);
    }

    @Override
    public String createPermalink(Site site) {

        if (this.getName() != null) {
            return StringUtils.toNormalized(name);
        } else {
            return null;
        }
    }
}
