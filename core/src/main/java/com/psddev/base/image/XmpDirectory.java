package com.psddev.base.image;

enum XmpDirectory implements MetadataField {

    XMP_VALUE_COUNT("XMP Value Count"),
    RATING("Rating");

    private String fieldName;

    XmpDirectory(String fieldName) {
        this.fieldName = fieldName;
    }

    @Override
    public String getDirectoryName() {
        return "Xmp";
    }

    @Override
    public String getFieldName() {
        return fieldName;
    }
}
