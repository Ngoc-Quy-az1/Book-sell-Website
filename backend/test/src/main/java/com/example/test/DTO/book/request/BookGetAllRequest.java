package com.example.test.DTO.book.request;

import java.util.List;

public class BookGetAllRequest {
    private String sort;
    private Integer minPrice;
    private Integer maxPrice;    
    private int page = 0;
    private int size = 20;
    private List<String> category; 
    private String search;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public Integer getMinPrice() {
        return minPrice;
    }
    
    public void setMinPrice(Integer minPrice) {
        this.minPrice = minPrice;
    }
    
    public Integer getMaxPrice() {
        return maxPrice;
    }
    
    public void setMaxPrice(Integer maxPrice) {
        this.maxPrice = maxPrice;
    }
    

    public List<String> getCategory() {
        return category;
    }

    public void setCategory(List<String> category) {
        this.category = category;
    }
    

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }
}