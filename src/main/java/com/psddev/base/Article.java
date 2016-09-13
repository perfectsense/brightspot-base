package com.psddev.base;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.ToolUi;

public class Article extends Content implements Linkable {

    @Required
    private String headline;

    private Author author;

    @ToolUi.RichText(inline = false)
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
