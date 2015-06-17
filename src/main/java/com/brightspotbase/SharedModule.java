package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.dari.db.Recordable;

@Renderer.Path("/render/modules/shared-module.jsp")
@Recordable.Embedded
public class SharedModule extends Content implements FullWidthModule {

    private FullWidthModule module;

    public FullWidthModule getModule() {
        return module;
    }

    public void setModule(FullWidthModule module) {
        this.module = module;
    }

    @Override
    public String getLabel() {
        return getModule() != null ? getModule().getState().getLabel() : null;
    }
}