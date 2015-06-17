package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;

import java.util.List;

@Renderer.Path("/render/modules/list-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(300)
public class ListModule extends Content implements HalfWidthModule, DoubleHeightModule {

    private String name;
    private List<Link> links;

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
