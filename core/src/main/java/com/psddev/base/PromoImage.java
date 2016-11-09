package com.psddev.base;

import com.psddev.base.rte.BasicRichTextToolbar;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;

@Recordable.Embedded
public class PromoImage extends Record {

    private Image promoImage;

    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    @ToolUi.Placeholder(dynamicText = "${content.creditFallback}", editable = true)
    private String promoImageCredit;

    @ToolUi.RichText(toolbar = BasicRichTextToolbar.class)
    @ToolUi.Placeholder(dynamicText = "${content.captionFallback}", editable = true)
    private String promoImageCaption;

    public String getPromoImageCredit() {
        return promoImageCredit;
    }

    public void setPromoImageCredit(String promoImageCredit) {
        this.promoImageCredit = promoImageCredit;
    }

    public String getPromoImageCaption() {
        return promoImageCaption;
    }

    public void setPromoImageCaption(String promoImageCaption) {
        this.promoImageCaption = promoImageCaption;
    }

    public String getCreditFallback() {
        if (promoImage != null) {
            return promoImage.getCredit();
        }
        return null;
    }

    public String getCaptionFallback() {
        if (promoImage != null) {
            return promoImage.getCaption();
        }
        return null;
    }
}
