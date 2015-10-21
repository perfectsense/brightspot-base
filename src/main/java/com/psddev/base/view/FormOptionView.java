package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("components/bsp-form-option")
public interface FormOptionView {

    Map<String, String> getAttributes();

    String getText();
}
