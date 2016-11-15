package com.psddev.base.image;

interface MetadataField {

    String getDirectoryName();

    String getFieldName();

    default String getMetadataFieldKey() {
        return getDirectoryName() + "/" + getFieldName().replace("/", "//");
    }
}
