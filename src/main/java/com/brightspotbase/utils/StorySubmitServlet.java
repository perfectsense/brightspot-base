package com.brightspotbase.utils;

import com.brightspotbase.Author;
import com.brightspotbase.Image;
import com.brightspotbase.Story;
import com.psddev.cms.db.Workflow;
import com.psddev.dari.db.ReferentialText;
import com.psddev.dari.util.*;
import com.psddev.social.UserGeneratedContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

 // Creates a new Story object when submitted from the online form.

@MultipartConfig
@WebServlet(urlPatterns = "/story-submit")
public class StorySubmitServlet extends HttpServlet {

    private static final Logger LOGGER = LoggerFactory.getLogger(StorySubmitServlet.class);

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        LOGGER.info("Doing POST");

        String userName = request.getParameter("userName");
        String userEmail = request.getParameter("userEmail");
        String headline = request.getParameter("subject");
        String body = request.getParameter("storyBody");



        if (!StringUtils.isBlank(userName) && !StringUtils.isBlank(headline)) {
            Story story = new Story();
            story.setHeadline(headline);
            ReferentialText text = new ReferentialText();
            text.addHtml(body);
            story.setBody(text);

            Part filePart = request.getPart("file");
            LOGGER.info("PART IS : " + filePart);
            if (filePart != null) {
                Image image = new Image();
                image.setFile(createStorageItemFromPart(filePart));
                image.save();
                story.setLeadImage(image);

            }

            Author author = new Author();
            author.setName(userName);
            author.setEmail(userEmail);
            author.save();
            story.as(UserGeneratedContent.Data.class).setSubmitUser(author);
            story.setAuthor(author);
            story.as(Workflow.Data.class).getState().put("cms.workflow.currentState", "Pending Approval");
            story.save();
        }

        response.sendRedirect("/submit?_context=success");
        LOGGER.info("END POST");
    }

    public static StorageItem createStorageItemFromPart(Part filePart)throws ServletException, IOException {

        LOGGER.info("CREATING STORAGE ITEM FROM PART");

        String fileName = filePart.getName();
        String contentType = filePart.getContentType();
        Map<String, List<String>> httpHeaders = new LinkedHashMap<String, List<String>>();

        httpHeaders.put("Cache-Control", Collections.singletonList("public, max-age=31536000"));
        httpHeaders.put("Content-Length", Collections.singletonList(String.valueOf(filePart.getSize())));
        httpHeaders.put("Content-Type", Collections.singletonList(contentType));

        StorageItem item = StorageItem.Static.createIn(Settings.getOrDefault(String.class, StorageItem.DEFAULT_STORAGE_SETTING, null));

        item.setPath(createStorageItemPath(filePart.getName(), null));
        item.setContentType(contentType);
        item.getMetadata().put("http.headers", httpHeaders);
        item.getMetadata().put("originalFilename", fileName);
        item.setData(filePart.getInputStream());

        if (contentType != null && contentType.startsWith("image/")) {
            InputStream fileInput = filePart.getInputStream();

            try {
                ImageMetadataMap metadata = new ImageMetadataMap(fileInput);
                item.getMetadata().putAll(metadata);

            } finally {
                IoUtils.closeQuietly(fileInput);
            }
        }

        item.save();

        LOGGER.info("STORAGE ITEM CREATED");

        return item;
    }

    public static String createStorageItemPath(String fileName, String label) {
        String idString = UUID.randomUUID().toString().replace("-", "");
        StringBuilder pathBuilder = new StringBuilder();
        String extension = "";

        if (!ObjectUtils.isBlank(fileName)) {
            int lastDotAt = fileName.indexOf('.');

            if (lastDotAt > -1) {
                extension = fileName.substring(lastDotAt);
                fileName = fileName.substring(0, lastDotAt);

            }
        }

        if (ObjectUtils.isBlank(label) ||
                ObjectUtils.to(UUID.class, label) != null) {
            label = fileName;
        }

        if (ObjectUtils.isBlank(label)) {
            label = UUID.randomUUID().toString().replace("-", "");
        }

        pathBuilder.append(idString.substring(0, 2));
        pathBuilder.append('/');
        pathBuilder.append(idString.substring(2, 4));
        pathBuilder.append('/');
        pathBuilder.append(idString.substring(4));
        pathBuilder.append('/');
        pathBuilder.append(StringUtils.toNormalized(label));
        pathBuilder.append(extension);

        return pathBuilder.toString();
    }
}
