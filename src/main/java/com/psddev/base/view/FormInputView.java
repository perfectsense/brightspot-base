package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.Map;

@HandlebarsTemplate("components/bsp-form-input")
public interface FormInputView {

    Boolean isShowMessagesAbove();

    Boolean isLabelAfterInput();

    Map<String, String> getAttributes();

    Map<String, String> getErrorMessages();

    Map<String, String> getLabelAttributes();

    Object getLabel();

    Boolean isAutoSubmit();
}
