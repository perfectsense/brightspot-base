package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;

@ToolUi.Publishable(false)
public class Tag extends Content {

    @Required
    @Indexed
    private String name;

    @ToolUi.Placeholder(dynamicText = "${content.displayNameFallback}", editable = true)
    private String displayName;

    @ToolUi.Note("Note: If enabled, this tag will be hidden from display on asset pages and modules")
    private boolean hidden;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        if (displayName == null) {
            return getDisplayNameFallback();
        }
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public String getDisplayNameFallback() {
        return name;
    }
}
