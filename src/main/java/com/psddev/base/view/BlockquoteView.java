package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("components/bsp-blockquote")
public interface BlockquoteView {

    String getAuthor();

    String getContent();
}
