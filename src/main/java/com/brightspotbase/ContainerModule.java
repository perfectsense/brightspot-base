package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;

import java.util.List;

@Renderer.Path("/render/modules/container-module.jsp")
public class ContainerModule extends Content implements FullWidthModule {

    
    @Embedded
    private List<LayoutContainer> containers;


    public List<LayoutContainer> getContainers() {
        return containers;
    }

    public void setContainers(List<LayoutContainer> containers) {
        this.containers = containers;
    }

    @Renderer.Path("/render/modules/layout-a.jsp")
    public static class LayoutA extends Record implements LayoutContainer {

        @ToolUi.LayoutField(left = 0, top = 0, width = 300, height = 200)
        @Embedded
        private HalfWidthModule moduleLeft;
        @ToolUi.LayoutField(left = 300, top = 0, width = 300, height = 200)
        @Embedded
        private HalfWidthModule moduleRight;
        @ToolUi.LayoutField(left = 0, top = 200, width = 600, height = 200)
        @Embedded
        private FullWidthModule moduleBottom;


        public HalfWidthModule getModuleLeft() {
            return moduleLeft;
        }

        public void setModuleLeft(HalfWidthModule moduleLeft) {
            this.moduleLeft = moduleLeft;
        }

        public HalfWidthModule getModuleRight() {
            return moduleRight;
        }

        public void setModuleRight(HalfWidthModule moduleRight) {
            this.moduleRight = moduleRight;
        }

        public FullWidthModule getModuleBottom() {
            return moduleBottom;
        }

        public void setModuleBottom(FullWidthModule moduleBottom) {
            this.moduleBottom = moduleBottom;
        }
    }

    @Renderer.Path("/render/modules/layout-b.jsp")
    public static class LayoutB extends Record implements LayoutContainer {

        @ToolUi.LayoutField(left = 300, top = 0, width = 300, height = 200)
        @Embedded
        private HalfWidthModule moduleRightTop;
        @ToolUi.LayoutField(left = 300, top = 200, width = 300, height = 200)
        @Embedded
        private HalfWidthModule moduleRightBottom;
        @ToolUi.LayoutField(left = 0, top = 0, width = 300, height = 400)
        @Embedded
        private DoubleHeightModule moduleLeft;

        public HalfWidthModule getModuleRightTop() {
            return moduleRightTop;
        }

        public void setModuleRightTop(HalfWidthModule moduleRightTop) {
            this.moduleRightTop = moduleRightTop;
        }

        public HalfWidthModule getModuleRightBottom() {
            return moduleRightBottom;
        }

        public void setModuleRightBottom(HalfWidthModule moduleRightBottom) {
            this.moduleRightBottom = moduleRightBottom;
        }

        public DoubleHeightModule getModuleLeft() {
            return moduleLeft;
        }

        public void setModuleLeft(DoubleHeightModule moduleLeft) {
            this.moduleLeft = moduleLeft;
        }
    }

    public interface LayoutContainer extends Recordable {}


    
}