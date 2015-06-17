package com.brightspotbase;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

public interface Branded extends Recordable {

    static final String LABEL = "Branding";

    @DisplayName(LABEL)
    @BeanProperty("brandData")
    public static class Data extends Modification<Branded> {

        @ToolUi.Tab(LABEL)
        private Image headerImage;
        @ToolUi.Tab(LABEL)
        private Image backgroundImage;
        @ToolUi.Tab(LABEL)
        @ToolUi.ColorPicker
        private String headerColor = "#043045";

        public String getHeaderColor() {
            return headerColor;
        }

        public void setHeaderColor(String headerColor) {
            this.headerColor = headerColor;
        }

        public Image getHeaderImage() {
            return headerImage;
        }

        public void setHeaderImage(Image headerImage) {
            this.headerImage = headerImage;
        }

        public Image getBackgroundImage() {
            return backgroundImage;
        }

        public void setBackgroundImage(Image backgroundImage) {
            this.backgroundImage = backgroundImage;
        }
    }
}