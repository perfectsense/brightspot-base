package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ReferentialText;

@Renderer.LayoutPath("/render/common/page-container.jsp")
@Renderer.Paths({
        @Renderer.Path(value = "/render/model/submit.jsp"),
        @Renderer.Path(context = "success", value = "/render/model/submit.jsp"),
})
@Renderer.EmbedPath("/render/common/page-container.jsp")
public class SubmitPage extends Content implements Branded {

    @Required
    private String name;
    private ReferentialText submitText;
    private String successMessage;
    private Link successLink;

    @ToolUi.Heading("End Module")
    private FullWidthModule endModule;

    public ReferentialText getSubmitText() {
        return submitText;
    }

    public FullWidthModule getEndModule() {
        return endModule;
    }

    public void setEndModule(FullWidthModule endModule) {
        this.endModule = endModule;
    }

    public void setSubmitText(ReferentialText submitText) {
        this.submitText = submitText;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSuccessMessage() {
        return successMessage;
    }

    public void setSuccessMessage(String successMessage) {
        this.successMessage = successMessage;
    }

    public Link getSuccessLink() {
        return successLink;
    }

    public void setSuccessLink(Link successLink) {
        this.successLink = successLink;
    }
}
