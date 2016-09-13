package com.psddev.base;

import com.psddev.cms.db.Content;

public class Author extends Content {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
