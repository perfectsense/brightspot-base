package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;

import java.util.List;

@Renderer.Path("/render/model/homepage-object.jsp")
@Renderer.LayoutPath("/render/common/page-container.jsp")
public class Homepage extends Content implements OpenGraph {

    @Required
    private String name = "Homepage";
    @Required
    @Embedded
    private SuperPromoModule homepageLead;
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

    public SuperPromoModule getHomepageLead() {
        return homepageLead;
    }

    public void setHomepageLead(SuperPromoModule homepageLead) {
        this.homepageLead = homepageLead;
    }
}
