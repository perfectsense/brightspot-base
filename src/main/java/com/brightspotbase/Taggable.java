package com.brightspotbase;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

import java.util.List;

public interface Taggable extends Recordable {

    @BeanProperty("tagData")
    public static class Data extends Modification<Taggable> {

        @ToolUi.Heading("Tags")
        @Indexed
        private List<Tag> tags;


        public List<Tag> getTags() {
            return tags;
        }

        public void setTags(List<Tag> tags) {
            this.tags = tags;
        }
    }


}