package com.brightspotbase;

import com.psddev.cms.db.Content;

import java.util.List;

public class Header extends Content {

    private String name;
    private List<Link> links;
    private Link shareLink;


    public Link getShareLink(){
        return shareLink;
    }
    
    public void setShareLink(Link shareLink){
        this.shareLink = shareLink;
    }

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
