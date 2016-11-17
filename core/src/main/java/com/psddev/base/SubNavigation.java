package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;

@Recordable.DisplayName("Sub-Navigation")
@Recordable.Embedded
public class SubNavigation extends Record implements NavigationItem {

    @DisplayName("Sub-Navigation Title")
    @Required
    private String name;

    private List<LinkedText> items;

    public String getName() {
        return name;
    }

    public List<LinkedText> getItems() {
        if (items == null) {
            items = new ArrayList<>();
        }
        return items;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setItems(List<LinkedText> items) {
        this.items = items;
    }
}
