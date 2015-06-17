package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.social.UserGeneratedContentUser;

public class Author extends Content implements UserGeneratedContentUser {

    @Required
    @Indexed
    private String name;
    private String email;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
