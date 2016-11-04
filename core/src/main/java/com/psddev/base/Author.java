package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;

@ToolUi.Publishable(false)
public class Author extends Content {

    @Required
    @Indexed
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
