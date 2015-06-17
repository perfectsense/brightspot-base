package com.brightspotbase.utils;

import com.psddev.cms.db.PageFilter;
import com.psddev.cms.db.Profile;
import com.psddev.dari.util.AbstractFilter;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.StringUtils;
import com.psddev.dari.util.WebPageContext;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

// Provides hooks to flag mobile, tablet and desktop use

public class DeviceDetectionFilter extends AbstractFilter implements AbstractFilter.Auto {

    private static final String MOBILE_DETECTION_ATTR = "mobileDetectComplete";
    public static final String IS_MOBILE_ATTR = "isMobile";
    public static final String IS_TABLET_ATTR = "isTablet";
    public static final String IS_TOUCH_ATTR = "isTouch";

    @Override
    protected void doRequest(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws Exception {
        doDetection(request);
        super.doRequest(request, response, chain);
    }

    public static void doDetection(HttpServletRequest request) throws Exception {

        Profile profile = PageFilter.Static.getProfile(request);
        String userAgent = profile.getUserAgent();

        boolean isMsie = false;
        boolean isMsieMobile = false;
        boolean isAndroid = false;
        boolean isAndroidPhone = false;
        boolean isIOS = false;
        boolean isIOSMobile = false;
        boolean isMobile = false;
        boolean isTablet = false;
        boolean isTouch = false;

        if (!StringUtils.isBlank(userAgent)) {

            isMsieMobile = profile.isUserAgentMsieMobile();

            isMsie = isMsieMobile
                    || profile.isUserAgentMsie();

            isIOSMobile = profile.isUserAgentIphone();

            isIOS = isIOSMobile
                    || profile.isUserAgentIpad();

            isAndroid = profile.isUserAgentAndroid();

            isAndroidPhone = isAndroid && userAgent.toLowerCase().contains("mobile");

            isMobile = isAndroidPhone
                    || isMsieMobile
                    || isIOSMobile;

            isTouch = userAgent.toLowerCase().contains("Touch");
        }

        isTablet = (isAndroid || isIOS) && !isMobile;
        isTouch = isMobile || isTablet || isTouch;

        if (isMobile) {
            request.setAttribute("pageDeliveryType", "MOBILE");
        }

        request.setAttribute(IS_MOBILE_ATTR, isMobile);
        request.setAttribute(IS_TABLET_ATTR, isTablet);
        request.setAttribute(IS_TOUCH_ATTR, isTouch);
        request.setAttribute(MOBILE_DETECTION_ATTR, true);
    }

    public static boolean isMobileDetected(HttpServletRequest request) throws Exception {
        verifyComplete(request);
        return ObjectUtils.to(boolean.class, request.getAttribute(IS_MOBILE_ATTR));
    }

    public static boolean isTabletDetected(HttpServletRequest request) throws Exception {
        verifyComplete(request);
        return ObjectUtils.to(boolean.class, request.getAttribute(IS_TABLET_ATTR));
    }

    private static void verifyComplete(HttpServletRequest request) throws Exception {
        WebPageContext wp = new WebPageContext((ServletContext) null, request, null);
        if (!(wp.paramOrDefault(Boolean.class, MOBILE_DETECTION_ATTR, false))) {
            doDetection(request);
        }
    }

    @Override
    public void updateDependencies(Class<? extends AbstractFilter> filterClass, List<Class<? extends Filter>> dependencies) {
        if (PageFilter.class.isAssignableFrom(filterClass)) {
            dependencies.add(DeviceDetectionFilter.class);
        }
    }
}