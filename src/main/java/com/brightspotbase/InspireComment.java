package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.dari.db.Recordable.DisplayName;
import com.psddev.social.UserGeneratedContent;
import com.psddev.cms.db.ToolUi;

@DisplayName("Comment")
public class InspireComment extends Content implements UserGeneratedContent {

    private String commentText;
    @Indexed
    @ToolUi.Hidden
    private Story story;
    @ToolUi.Hidden
    private SocialUser socialUser;


    public SocialUser getSocialUser(){
        return socialUser;
    }
    
    public void setSocialUser(SocialUser socialUser){
        this.socialUser = socialUser;
    }

    public Story getStory(){
        return story;
    }
    
    public void setStory(Story story){
        this.story = story;
    }

    public String getCommentText(){
        return commentText;
    }
    
    public void setCommentText(String commentText){
        this.commentText = commentText;
    }
}
