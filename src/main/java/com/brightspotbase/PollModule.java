package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.dari.db.Record;

import java.util.List;


@Renderer.Path("/render/modules/poll-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(300)
public class PollModule extends Content implements HalfWidthModule, DoubleHeightModule {

    private String name;
    private String question;
    @Embedded
    private List<Option> options;


    public List<Option> getOptions(){
        return options;
    }
    
    public void setOptions(List<Option> options){
        this.options = options;
    }


    public static class Option extends Record {

        private String option;


        public String getOption(){
            return option;
        }
        
        public void setOption(String option){
            this.option = option;
        }

    }


    public String getQuestion(){
        return question;
    }
    
    public void setQuestion(String question){
        this.question = question;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}