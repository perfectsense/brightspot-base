package com.brightspotbase.utils;

import com.brightspotbase.Footer;
import com.brightspotbase.Header;
import com.psddev.cms.tool.Tool;

// Global settings defined here

public class GlobalSettings extends Tool {

    private Header header;
    private Footer footer;


    public Footer getFooter() {
        return footer;
    }

    public void setFooter(Footer footer) {
        this.footer = footer;
    }

    public Header getHeader() {
        return header;
    }

    public void setHeader(Header header) {
        this.header = header;
    }
}
