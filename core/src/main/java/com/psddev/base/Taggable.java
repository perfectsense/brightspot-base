package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

public interface Taggable extends Recordable {

    @FieldInternalNamePrefix("tagData")
    class Data extends Modification<Taggable> {

        @Indexed
        private List<Tag> tags;

        public List<Tag> getTags() {
            if (tags == null) {
                return new ArrayList<>();
            }
            return tags;
        }

        public void setTags(List<Tag> tags) {
            this.tags = tags;
        }
    }
}
