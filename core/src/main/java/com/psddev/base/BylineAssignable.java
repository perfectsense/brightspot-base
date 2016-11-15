package com.psddev.base;

import java.util.ArrayList;
import java.util.List;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

public interface BylineAssignable extends Recordable {

    default Data asBylineData() {
        return as(Data.class);
    }

    @FieldInternalNamePrefix("bylineData")
    class Data extends Modification<BylineAssignable> {

        @Indexed
        @ToolUi.Filterable
        private List<Author> authors;

        public List<Author> getAuthors() {
            if (authors == null) {
                return new ArrayList<>();
            }
            return authors;
        }

        public void setAuthors(List<Author> authors) {
            this.authors = authors;
        }
    }
}
