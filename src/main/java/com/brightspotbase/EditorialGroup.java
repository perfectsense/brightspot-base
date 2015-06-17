package com.brightspotbase;


import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolEntity;
import com.psddev.cms.db.ToolUser;

import java.util.LinkedHashSet;
import java.util.Set;

 // Create custom editorial groups for use when notifying teams during workflow

public class EditorialGroup extends Content implements ToolEntity {

    @Indexed(unique = true)
    @Required
    private String name;

    @Indexed
    private Set<ToolUser> users;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public Set<ToolUser> getUsers() {
        if (users == null) {
            users = new LinkedHashSet<ToolUser>();
        }
        return users;
    }

    public void setUsers(Set<ToolUser> users) {
        this.users = users;
    }
}