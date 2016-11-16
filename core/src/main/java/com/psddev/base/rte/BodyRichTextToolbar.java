package com.psddev.base.rte;

import java.util.Arrays;
import java.util.List;

import com.psddev.cms.rte.RichTextToolbar;
import com.psddev.cms.rte.RichTextToolbarAction;
import com.psddev.cms.rte.RichTextToolbarItem;
import com.psddev.cms.rte.RichTextToolbarSeparator;
import com.psddev.cms.rte.RichTextToolbarStyle;

public class BodyRichTextToolbar implements RichTextToolbar {

    @Override
    public List<RichTextToolbarItem> getItems() {
        return Arrays.asList(
            RichTextToolbarStyle.BOLD,
            RichTextToolbarStyle.ITALIC,
            RichTextToolbarStyle.UNDERLINE,
            RichTextToolbarStyle.STRIKETHROUGH,
            RichTextToolbarStyle.SUPERSCRIPT,
            RichTextToolbarStyle.SUBSCRIPT,
            RichTextToolbarStyle.LINK,
            RichTextToolbarStyle.HTML,
            RichTextToolbarAction.CLEAR,

            RichTextToolbarSeparator.BLOCK,

            RichTextToolbarStyle.UL,
            RichTextToolbarStyle.OL,

            RichTextToolbarItem.CUSTOM,

            RichTextToolbarSeparator.BLOCK,

            RichTextToolbarAction.MARKER,
            RichTextToolbarAction.TABLE,

            RichTextToolbarSeparator.BLOCK,

            RichTextToolbarItem.ELEMENTS,

            RichTextToolbarSeparator.BLOCK,

            RichTextToolbarAction.FULLSCREEN,
            RichTextToolbarAction.MODE
        );
    }
}
