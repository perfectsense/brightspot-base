package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;

public class Article extends Content implements Taggable {

    @Required
    @Indexed
    private String headline;

    @Indexed
    private Author author;

    @ToolUi.RichText
    private String body;

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
