package com.brightspotbase;

import com.psddev.cms.db.Content;

import java.util.List;

public class Footer extends Content {

    private String name;
    private List<Link> links;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }


}
