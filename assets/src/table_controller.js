import { Controller } from '@hotwired/stimulus';

import './css/list.css';

import $ from 'jquery';

import 'bootstrap-table';
import 'tableexport.jquery.plugin/tableExport.min';
import 'bootstrap-table/dist/extensions/export/bootstrap-table-export'
import 'bootstrap-table/dist/locale/bootstrap-table-es-ES';
import 'bootstrap-table/dist/locale/bootstrap-table-eu-EU';

import { createConfirmationAlert } from './alert';

class table extends Controller {
    static targets = [
        'table'
    ];
    static values = {
        url: String,
        exportName: String,
        filters: Object,
    }

    params = new URLSearchParams(this.filtersValue ?? {});
    $table = null;
    locale = null;

    getOptions() {
        return {
            cache: false,
            showExport: true,
            exportTypes: ['excel'],
            exportDataType: 'all',
            iconsPrefix: 'fa',
            icons: {
                export: 'fa-download',
                detailOpen: 'fa-plus',
                detailClose: 'fa-minus',
            },
            exportOptions: {
                fileName: this.exportNameValue,
                ignoreColumn: ['options'],
            },
            showColumns: false,
            pagination: true,
            search: true,
            striped: true,
            sortStable: true,
            pageList: [10, 25, 50, 100],
            sortable: true,
            detailFormatter: this.detailFormatter,
            locale: this.locale + '-' + this.locale.toUpperCase(),
        };
    }

    detailFormatter(index, row) {
        return row[2];
    }

    connect() {
        this.locale = global.locale ?? document.getElementsByTagName("html")[0].getAttribute('lang');
        let controller = this;
        if (this.hasTableTarget) {
            this.$table = $(this.tableTarget);
            this.$table.bootstrapTable(this.getOptions());
        } else if (this.element.nodeName.toLowerCase() == "table") {

            this.$table = $(this.element);
            this.$table.bootstrapTable(this.getOptions());
        }
        if ( this.$table != null ) {
            $(function() {
                $('#toolbar').find('select').change(function() {
                    this.$table.bootstrapTable('destroy').bootstrapTable({
                        exportDataType: $(this).val(),
                        exportTypes: ['excel'],
                    });
                });
            });
            this.$table.on('page-change.bs.table',function(e, page, pageSize) {
                controller.params.set('page', page);
                controller.params.set('pageSize', pageSize);
            }); 
            this.$table.on('sort.bs.table',function(e, sortName, sortOrder) {
                controller.params.set('sortName', sortName);
                controller.params.set('sortOrder', sortOrder);
            }); 
            $('.page-list').find('button').attr('data-bs-toggle','dropdown');
            if ( this.pageValue !== null && this.$table.bootstrapTable("getOptions").totalPages >= this.pageValue ) {
                this.$table.bootstrapTable('selectPage', this.pageValue);
            }
        }
    }

    onClick(event) {
        event.preventDefault();
        const destination = event.currentTarget.href;
        const confirm = event.currentTarget.dataset.confirm;
        this.createQueryParameters(event);
        if ( confirm == "true") {
            console.log(destination + '?' + this.params.toString());
            createConfirmationAlert(destination + '?' + this.params.toString()); 
        } else {
            console.log(destination + '?' + this.params.toString());
            document.location.href= destination + '?' + this.params.toString(); 
        }
    }

    createQueryParameters(event) {
        if ( this.$table != null ) {
            this.setPaginationParameters();
        }
        const ajax = event.currentTarget.dataset.ajax;
        if ( ajax != null && ajax == "false" ) {
            this.params.delete('ajax');
        }
        this.setFilterParameters();
        if (event.currentTarget.dataset.return != "false") {
            this.createReturnUrlParameter(event);
        }
        if (event.currentTarget.dataset.pagination == "false") {
            this.deletePaginationParameters();
            this.deleteFilterParameters();
        }
    }

    setFilterParameters() {
        if ( this.hasFiltersValue ) {
            for (const property in this.filtersValue) {
                this.params.set(property,this.filtersValue[property]);
            }            
        }
    }

    setPaginationParameters() {
        const page = this.$table.bootstrapTable('getOptions').pageNumber != null ? this.$table.bootstrapTable('getOptions').pageNumber : 1;
        const pageSize = this.$table.bootstrapTable('getOptions').pageSize != null ? this.$table.bootstrapTable('getOptions').pageSize : 10;
        const sortName = this.$table.bootstrapTable('getOptions').sortName != null ? this.$table.bootstrapTable('getOptions').sortName : 0;
        const sortOrder = this.$table.bootstrapTable('getOptions').sortOrder != null ? this.$table.bootstrapTable('getOptions').sortOrder : 'asc';
        this.params.set('page', page);
        this.params.set('pageSize', pageSize);
        this.params.set('sortName', sortName);
        this.params.set('sortOrder', sortOrder);
    }

    deleteFilterParameters() {
        if ( this.hasFiltersValue ) {
            for (const property in this.filtersValue) {
                this.params.delete(property);
            }            
        }
    }

    deletePaginationParameters() {
        this.params.delete('page');
        this.params.delete('pageSize');
        this.params.delete('sortName');
        this.params.delete('sortOrder');
    }

    createReturnUrlParameter(event) {
        let returnUrl = null;
        if (event.currentTarget.dataset.returnUrl != null) {
            returnUrl = new URL(event.currentTarget.dataset.returnUrl);    
        } else {
            location = new URL(document.location.href);
            returnUrl = new URL(`${location.origin}${location.pathname}`);
        }
        const urlParams = new URLSearchParams(returnUrl.search);
        if (returnUrl != null) {
            let entries = this.params.entries();
            for (let [key, value] of entries) {
                urlParams.set(key, value);
            }
            returnUrl = `${returnUrl.origin}${returnUrl.pathname}?`+urlParams.toString();
            this.params.set('returnUrl', returnUrl);
        }
    }

    async refreshContent(event) {
        this.params.set('ajax', true);
        this.setPaginationParameters();
        const target = this.hasContentTarget ? this.contentTarget : this.element;
        target.style.opacity = .5;
        if (event.type === 'entity:success') {
            const response = await fetch(this.urlValue+ '?' + this.params.toString());
            target.innerHTML = await response.text();
        }
        target.style.opacity = 1;
        this.connect();
    }
}
     
export { table };
