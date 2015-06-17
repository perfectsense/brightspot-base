package com.brightspotbase;

import com.github.jknack.handlebars.*;
import com.github.jknack.handlebars.io.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class TemplateRenderer {
    
    protected Handlebars handlebars;
    protected JsonParser parser;
    protected Template template;
    protected TemplateLoader loader;
    
    public TemplateRenderer() {
        this("/", ".hbs");
    }
    
    public TemplateRenderer(String prefix, String extension) {
        loader = new ClassPathTemplateLoader(prefix, extension);
        handlebars = new Handlebars(loader);
        parser = new JsonParser();
    }
    
    public String renderTemplate(String templateName, String data) throws IOException {
        JsonObject obj = parser.parse(data).getAsJsonObject();
        return renderTemplate(templateName, obj);
    }

    public String renderTemplate(String templateName, URL url) throws IOException {
        String data = getDataFromUrl(url);
        return renderTemplate(templateName, data);
    }
    
    /** must override this method */
    public String renderTemplate(String templateName, JsonObject data) throws IOException {
        return "";
    }
    
    public String getDataFromUrl(URL url) {
        try {
            InputStream is = url.openStream();
            StringBuffer buffer = new StringBuffer();
            int ptr = 0;
            while( (ptr = is.read()) != -1 ) {
                buffer.append((char)ptr);
            }
            return buffer.toString().trim();
        } catch(IOException e) {
            return e.getMessage();
        }
    }
    
    protected void compileTemplate(String templateName) throws IOException {
        template = handlebars.compile(templateName);
    }
}
