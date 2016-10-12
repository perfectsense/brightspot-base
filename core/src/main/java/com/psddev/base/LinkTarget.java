package com.psddev.base;

public enum LinkTarget {

    NEW("New Window/Tab", "_blank");

    private final String label;
    private final String value;

    LinkTarget(String label, String value) {
        this.label = label;
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return label;
    }
}
