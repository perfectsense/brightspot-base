package com.psddev.base;

import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

import java.util.ArrayList;
import java.util.List;

public interface Taggable extends Recordable {

    @BeanProperty("tagData")
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
