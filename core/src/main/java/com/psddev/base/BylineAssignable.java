package com.psddev.base;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.psddev.cms.db.ToolUi;
import com.psddev.cms.db.ToolUser;
import com.psddev.cms.tool.AuthenticationFilter;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Query;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.PageContextFilter;

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

        @Override
        protected void afterCreate() {
            super.afterCreate();

            ToolUser user = AuthenticationFilter.Static.getUser(PageContextFilter.Static.getRequest());

            if (user != null) {
                Author author = Query.from(Author.class).where("name = ?", user.getName()).first();

                if (author != null) {
                    setAuthors(Arrays.asList(author));
                }
            }
        }
    }
}
