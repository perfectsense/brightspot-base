package com.psddev.base;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.CompactMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Recordable.Embedded
public abstract class Link extends Record {

    public static final String ADVANCED_TAB = "Advanced";

    @ToolUi.Placeholder("Same Window/Tab")
    @ToolUi.Tab(ADVANCED_TAB)
    private LinkTarget target;

    @ToolUi.Tab(ADVANCED_TAB)
    private List<LinkAttribute> attributes;

    public LinkTarget getTarget() {
        return target;
    }

    public void setTarget(LinkTarget target) {
        this.target = target;
    }

    public List<LinkAttribute> getAttributes() {
        if (attributes == null) {
            attributes = new ArrayList<>();
        }
        return attributes;
    }

    public Map<String, String> getAttributesMap() {
        Map<String, String> map = new CompactMap<>();
        LinkTarget target = getTarget();

        if (target != null) {
            map.put("target", target.getValue());
        }

        getAttributes().forEach(a -> map.put(a.getName(), a.getValue()));

        return map;
    }

    public void setAttributes(List<LinkAttribute> attributes) {
        this.attributes = attributes;
    }

    public abstract String getLinkUrl();

    public String getLinkText() {
        return null;
    }
}
