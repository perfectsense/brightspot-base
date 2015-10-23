package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-search-results-filters")
public interface SearchResultsFiltersView {

    Object getHeading();

    List<Object> getCheckboxes();
}
