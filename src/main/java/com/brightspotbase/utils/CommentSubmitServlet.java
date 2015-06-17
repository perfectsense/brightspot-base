package com.brightspotbase.utils;

import com.brightspotbase.InspireComment;
import com.brightspotbase.SocialUser;
import com.brightspotbase.Story;
import com.psddev.dari.db.Query;
import com.psddev.dari.util.StringUtils;
import com.psddev.social.UserGeneratedContent;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = "/comment-submit")
public class CommentSubmitServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String name = request.getParameter("name");
        String comment = request.getParameter("comment");
        String id = request.getParameter("id");

        if (!StringUtils.isBlank(name) && !StringUtils.isBlank(comment)) {
            InspireComment inspireComment = new InspireComment();
            inspireComment.setCommentText(comment);
            inspireComment.setStory(Query.from(Story.class).where("_id = ?", id).first());
            SocialUser socialUser = new SocialUser();
            inspireComment.setSocialUser(socialUser);
            socialUser.setName(name);
            socialUser.save();
            inspireComment.as(UserGeneratedContent.Data.class).setSubmitUser(socialUser);
            inspireComment.save();
        }
    }
}
