package com.psddev.base.image;

enum PhotoshopDirectory implements MetadataField {

    // Nothing here yet, but need placeholder...
    FOO("foo");

    private String fieldName;

    PhotoshopDirectory(String fieldName) {
        this.fieldName = fieldName;
    }

    @Override
    public String getDirectoryName() {
        return "Photoshop";
    }

    @Override
    public String getFieldName() {
        return fieldName;
    }
}
