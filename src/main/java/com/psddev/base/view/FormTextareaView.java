package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;
import java.util.Map;

@HandlebarsTemplate("components/bsp-form-textarea")
public interface FormTextareaView {

    Boolean isShowMessagesAbove();

    Map<String, String> getAttributes();

    List<Object> getErrors();

    Object getLabel();
}
