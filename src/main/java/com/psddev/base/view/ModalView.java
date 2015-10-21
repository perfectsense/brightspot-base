package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

@HandlebarsTemplate("elements/modal")
public interface ModalView {

    String getId();

    Object getContent();
}
