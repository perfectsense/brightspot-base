package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ReferentialText;

@Renderer.Path("/render/modules/quote-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
@ToolUi.Referenceable
public class Quote extends Content {

    private String title;
    private ReferentialText quote;

    public ReferentialText getQuote() {
        return quote;
    }

    public void setQuote(ReferentialText quote) {
        this.quote = quote;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
