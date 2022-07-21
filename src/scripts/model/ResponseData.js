export default class ResponseData {
    constructor(data = {}) {
        this.code               = data.code || ''
        this.data               = data.data || []
        this.exception_msg      = data.exception_msg || ''
        this.is_error           = data.is_error || 0
        this.item_per_page      = data.item_per_page || 50
        this.message            = data.message || 0
        this.page_number        = data.page_number || 1
        this.next_page_number   = data.next_page_number || -1
        this.total_item_count   = data.total_item_count || 0
        
        /* Kendo Pager */
        this.skip               = data.skip || 0
        this.take               = data.take || 50
        this.buttonCount        = data.buttonCount || 5
        this.info               = data.info || true
        this.type               = data.type || 'numeric' // OR 'input'
        this.pageSizes          = data.pageSizes || true
        this.previousNext       = data.previousNext || true
        this.total              = data.total || 0
        this.pageSizeDefs       = data.pageSizeDefs || [30,50,100]

        /* Other */
        this.status             = data.status || 0
        this.statusText         = data.statusText || ""

        /* Set skip */
        if(this.next_page_number > 0){
            let pageNumber = this.next_page_number - 1;
            this.skip = (pageNumber * this.item_per_page) - this.item_per_page;
        }
    }
    
    constuct(data) {
        this.constructor(data);
    }
}