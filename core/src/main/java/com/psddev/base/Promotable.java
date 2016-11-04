package com.psddev.base;

import com.psddev.dari.db.Modification;
import com.psddev.dari.db.Recordable;

public interface Promotable extends Recordable {

    @FieldInternalNamePrefix("promotableData")
    class Data extends Modification<Promotable> {

        private PromoImage promoImage;

        public PromoImage getPromoImage() {
            return promoImage;
        }

        public void setPromoImage(PromoImage promoImage) {
            this.promoImage = promoImage;
        }
    }
}
