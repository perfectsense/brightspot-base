package com.brightspotbase;

import com.psddev.cms.db.ImageTag;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.ReferentialText;
import com.psddev.dari.util.HtmlWriter;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StorageItem;

import java.io.IOException;
import java.io.StringWriter;

public interface PromotableContent extends Taggable {

    static final String LABEL = "Promoted Fields";

    default String getPromoTitleFallback() {
        return null;
    }

    default Image getPromoImageFallback() {
        return null;
    }

    default ReferentialText getPromoDescriptionFallback() {
        return null;
    }

    @DisplayName(LABEL)
    @BeanProperty("promoData")
    public static class Data extends Modification<PromotableContent> {


        @ToolUi.Placeholder(dynamicText = "${content.promoTitleFallback}", editable = true)
        @ToolUi.Tab(LABEL)
        @ToolUi.DisplayFirst
        private String promoTitle;

        @ToolUi.Tab(LABEL)
        @ToolUi.DisplayFirst
        @ToolUi.NoteHtml("<span data-dynamic-html='${content.promoData.fallbackImageHtml}'></span>")
        private Image promoImage;

        @ToolUi.Placeholder(dynamicText = "${content.promoDescriptionFallback}", editable = true)
        @ToolUi.Tab(LABEL)
        @ToolUi.DisplayFirst
        @ToolUi.SuggestedMaximum(500)
        private ReferentialText promoDescription;


        public ReferentialText getPromoDescription() {
            if (ObjectUtils.isBlank(promoDescription)) {
                return getPromoDescriptionFallback();
            }
            return promoDescription;
        }

        public String getPromoTitle() {
            if (ObjectUtils.isBlank(promoTitle)) {
                return getPromoTitleFallback();
            }
            return promoTitle;
        }

        public Image getPromoImage() {
            if (ObjectUtils.isBlank(promoImage)) {
                return getPromoImageFallback();
            }
            return promoImage;
        }

        public void setPromoImage(Image promoImage) {
            this.promoImage = promoImage;
        }

        public void setPromoDescription(ReferentialText promoDescription) {
            this.promoDescription = promoDescription;
        }

        public void setPromoTitle(String promoTitle) {
            this.promoTitle = promoTitle;
        }

        public String getPromoTitleFallback() {
            return getOriginalObject().getPromoTitleFallback();
        }

        public Image getPromoImageFallback() {
            return getOriginalObject().getPromoImageFallback();
        }

        public ReferentialText getPromoDescriptionFallback() {
            return getOriginalObject().getPromoDescriptionFallback();
        }

        public String getFallbackImageHtml() throws IOException {

            if (promoImage == null) {

                Image fallbackImage = getOriginalObject().getPromoImageFallback();
                if (fallbackImage != null) {

                    StorageItem file = fallbackImage.getFile();
                    if (file != null) {

                        StringWriter html = new StringWriter();

                        new HtmlWriter(html) {
                            {
                                writeStart("p", "style", "margin:0 0 3px 0;");
                                writeHtml("Placeholder Image");
                                writeEnd();
                                writeTag("img",
                                        "src", new ImageTag.Builder(file).setHeight(100).toUrl(),
                                        "style", "width: auto; height: 100px; border:solid 1px #cdcdcd; padding: 3px;");
                            }
                        };

                        return html.toString();
                    }
                }
            }

            return null;
        }
    }
}