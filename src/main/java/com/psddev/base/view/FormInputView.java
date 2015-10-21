package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;
import java.util.Map;

@HandlebarsTemplate("components/bsp-form-input")
public interface FormInputView {

    Boolean isShowMessagesAbove();

    Boolean isLabelAfterInput();

    Map<String, String> getAttributes();

    List<Object> getErrors();

    Map<String, String> getLabelAttributes();

    // TYPE ERROR: label

    Boolean isAutoSubmit();
}
