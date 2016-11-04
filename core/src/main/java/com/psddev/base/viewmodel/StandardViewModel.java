package com.psddev.base.viewmodel;

import com.psddev.cms.db.Site;
import com.psddev.cms.view.ViewModel;
import com.psddev.cms.view.servlet.CurrentSite;
import com.psddev.cms.view.servlet.HttpHeader;
import com.psddev.cms.view.servlet.HttpMethod;
import com.psddev.cms.view.servlet.MainObject;

public abstract class StandardViewModel<M> extends ViewModel<M> {

    @HttpMethod
    private String method;

    @MainObject
    private Object mainObject;

    @CurrentSite
    private Site currentSite;

    @HttpHeader("User-Agent")
    private String userAgent;

    /**
     * @return true if the current request is a POST, false otherwise.
     */
    protected boolean isPost() {
        return "POST".equalsIgnoreCase(method);
    }

    /**
     * @return the main object as defined by {@link com.psddev.cms.db.PageFilter.Static#getMainObject(javax.servlet.http.HttpServletRequest)}.
     */
    protected Object getMainObject() {
        return mainObject;
    }

    /**
     * @return the current site as defined by {@link com.psddev.cms.db.PageFilter.Static#getSite(javax.servlet.http.HttpServletRequest)}.
     */
    protected Site getCurrentSite() {
        return currentSite;
    }

    /**
     * @return true if the request is from a mobile device, false otherwise.
     */
    protected boolean isMobile() {
        // TODO: implement more thorough device detect logic
        if (userAgent != null) {
            if (userAgent.contains("Mobile") || userAgent.contains("Mobi")) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return true if the request is from a desktop device, false otherwise.
     */
    protected boolean isDesktop() {
        return !isMobile();
    }
}
