package com.psddev.base.view;

import com.psddev.handlebars.HandlebarsTemplate;

import java.util.List;

@HandlebarsTemplate("components/bsp-search-results")
public interface SearchResultsView {

    Object getHeading();

    // TYPE ERROR: searchForm

    Object getSearchSort();

    Object getSearchFilter();

    List<Object> getSearchResults();

    Object getPagination();
}
