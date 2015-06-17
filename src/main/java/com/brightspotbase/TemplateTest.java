package com.brightspotbase;

import java.io.IOException;
import java.util.*;
import com.google.gson.JsonObject;

public class TemplateTest extends TemplateRenderer {
    
    @Override
    public String renderTemplate(String templateName, JsonObject data) throws IOException {
        compileTemplate(templateName);
        
        /** Handlebars.java wasn't taking a JsonObject, there's probably a better/more generic way to do this */
        HashMap map = new HashMap<String, String>();
        map.put("testVar", data.get("testVar").getAsString() );
        
        return template.apply(map);
    }
}