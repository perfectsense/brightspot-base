package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.dari.db.ReferentialText;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Path("/render/common/error.jsp")
public class ErrorPage extends Content {

    @Required
    private String name;
    private ReferentialText body;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ReferentialText getBody() {
        return body;
    }

    public void setBody(ReferentialText body) {
        this.body = body;
    }
}
