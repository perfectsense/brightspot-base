package com.psddev.base.image;

enum InteroperabilityDirectory implements MetadataField {

    VERSION("Interoperability Version"),
    INDEX("Interoperability Index");

    private String fieldName;

    InteroperabilityDirectory(String fieldName) {
        this.fieldName = fieldName;
    }

    @Override
    public String getDirectoryName() {
        return "Interoperability";
    }

    @Override
    public String getFieldName() {
        return fieldName;
    }
}
