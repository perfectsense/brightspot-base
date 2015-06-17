package com.brightspotbase;

import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

public interface OpenGraph extends Recordable {

    static final String LABEL = "Open Graph Content";

    @DisplayName(LABEL)
    @BeanProperty("og")
    public static class Data extends Modification<OpenGraph> {

        @ToolUi.Tab(LABEL)
        private Image ogImage;

        @ToolUi.Tab(LABEL)
        private String ogTitle;

        @ToolUi.Tab(LABEL)
        private String ogDescription;

        public Image getOgImage() {
            return ogImage;
        }

        public void setOgImage(Image ogImage) {
            this.ogImage = ogImage;
        }

        public String getOgTitle() {
            return ogTitle;
        }

        public void setOgTitle(String ogTitle) {
            this.ogTitle = ogTitle;
        }

        public String getOgDescription() {
            return ogDescription;
        }

        public void setOgDescription(String ogDescription) {
            this.ogDescription = ogDescription;
        }
    }
}