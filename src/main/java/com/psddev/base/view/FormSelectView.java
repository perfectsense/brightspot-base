package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;
import java.util.Map;

@HandlebarsTemplate("components/bsp-form-select")
public interface FormSelectView {

    Boolean isShowMessagesAbove();

    Map<String, String> getAttributes();

    List<Object> getErrors();

    // TYPE ERROR: label

    List<Object> getOptions();

    Boolean isAutoSubmit();
}
