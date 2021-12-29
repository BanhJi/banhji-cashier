<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-3">
            <v-card color="white" class=" no_border" elevation="0">
                <v-row>
                    <v-col sm="12" cols="12" class="pt-0">
                        <h2 class="mb-1 font_20">{{$t('cash_movement')}}</h2>
                        <p class="mb-0">{{$t('cash_movement_desc')}}</p>
                    </v-col>
                </v-row>

                <v-row >
                    <v-col sm="4" cols="12" class="pt-0">
                        <v-card outlined dense class="pa-3 no_border white--text" color="secondary" height="85px">
                            <h3 class="text-left text-uppercase font_13 flex-1">{{$t('cash_in')}}</h3>
                            <h3 class="text-right  font_20 flex-1 mt-6">{{ Number(cashIn).toLocaleString() }}</h3>
                        </v-card>
                    </v-col>
                    <v-col sm="4" cols="12" class="pt-0">
                        <v-card outlined dense class="pa-3 no_border white--text" color="third" height="85px">
                            <h3 class="text-left text-uppercase font_13 flex-1">{{$t('cash_out')}}</h3>
                            <h3 class="text-right font_20 flex-1 mt-6">{{ Number(cashOut).toLocaleString() }}</h3>
                        </v-card>
                    </v-col>
                    <v-col sm="4" cols="12" class="pt-0">
                        <v-card outlined dense class="pa-3 no_border black--text" color="grayBg" height="85px">
                            <h3 class="text-left text-uppercase font_13 flex-1">{{$t('cash_balance')}}</h3>
                            <h3 class="text-right font_20 flex-1 mt-6">{{ Number(cashBalance).toLocaleString() }}</h3>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col sm="9" cols="12" class="py-0">
                        <app-searchdate :initStartDate="startDate" @emitStartDate="startDate = $event"
                                        :initEndDate="endDate" @emitEndDate="endDate = $event" />
                    </v-col>
                    <v-col sm="1" cols="12" class="py-1">
                        <v-btn class="btn_search"  style="background-color: rgb(237, 241, 245)" @click="search">
                            <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
                        </v-btn>
                    </v-col>
                </v-row>

                <!-- loading -->
                <LoadingMe 
                    :isLoading ="showLoading" 
                    :fullPage  ="false" 
                    type="loading"
                    :myLoading ="true"/>

                <v-row >
                    <v-col sm="12" cols="12" class="py-0">
                        <kendo-datasource ref="dataSource"
                            :data="generalLedgerList"
                            :group="groupDefinition"
                            :aggregate="aggregateDefinition"
                            :group-paging="true"
                            :page='1'
                            :page-size='100'
                            :total='0'>
                        </kendo-datasource>

                        <kendo-grid id="gridGL" ref="gridGL" class="custom_grid" 
                            :data-source-ref="'dataSource'"
                            :groupable="true"
                            :sortable="true"
                            :column-menu="true"
                            :reorderable="true"
                            :resizable="true"
                            :noRecords="true"
                            :navigatable="true"
                            :pageable-always-visible="true"
                            :pageable-page-sizes="[20, 50, 100, 'all']"
                            :toolbar="['excel']"
                            :excel-file-name="'generalLedger.xlsx'"
                            :excel-filterable="true">
                            <kendo-grid-column 
                                :field="'journal_type'"
                                :title="$t('type')"
                                :width="100"
                                :group-footer-template="'Total:'"
                            />
                            <kendo-grid-column 
                                :field="'journal_date'"
                                :title="$t('date')"
                                :width="100"
                            />
                            <kendo-grid-column 
                                :field="'journal_number'" 
                                :title="$t('txn')"
                                :template="journalNumberTemplate"
                                :width="100"
                            />
                            <kendo-grid-column 
                                :field="'description'"
                                :title="$t('description')"
                                :width="150"
                            />
                            <kendo-grid-column 
                                :field="'primary_contact'"
                                :title="$t('name')"
                                :template="'<span>#=primary_contact.name#</span>'"
                                :width="140"
                                :hidden="true"
                            />
                            <kendo-grid-column 
                                :field="'account.number'"
                                :title="$t('acc_number')"
                                :width="140"
                                :hidden="true"
                            />
                            <kendo-grid-column 
                                :field="'account.name'"
                                :title="$t('acc_name')"
                                :width="140"
                                :hidden="true"
                                :group-header-template="'<span class=\'text-bold text-black\'>#=items[0].account.number# - #=items[0].account.name#</span>'"
                            />
                            <kendo-grid-column 
                                :field="'dr'" 
                                :title="$t('cash_in')"
                                :format="'{0:#,##0.##;(#,##0.##)}'"
                                :width="110"
                                :aggregates="['sum']"
                                :group-footer-template="'<div class=\'text-right\'>#=kendo.toString(sum, `n`)#</div>'"
                                :headerAttributes="{
                                    style: 'text-align: right;'
                                }"
                                :attributes="{
                                    style: 'text-align: right;'
                                }"
                            />
                            <kendo-grid-column 
                                :field="'cr'" 
                                :title="$t('cash_out')"
                                :format="'{0:#,##0.##;(#,##0.##)}'"
                                :width="110"
                                :aggregates="['sum']"
                                :group-footer-template="'<div class=\'text-right\'>#=kendo.toString(sum, `n`)#</div>'"
                                :headerAttributes="{
                                    style: 'text-align: right;'
                                }"
                                :attributes="{
                                    style: 'text-align: right;'
                                }"
                            />
                            <kendo-grid-column 
                                :field="'balance'"
                                :title="$t('balance')"
                                :format="'{0:#,##0.##;(#,##0.##)}'"
                                :width="140"
                                :group-header-column-template="openBalanceTemplate"
                                :groupHeaderColumnAttributes="{
                                    style: 'text-align: right; '
                                }"
                                :headerAttributes="{
                                    style: 'text-align: right; '
                                }"
                                :attributes="{
                                    style: 'text-align: right'
                                }"
                            />
                        </kendo-grid>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    // import { i18n } from '@/i18n'
    import kendo from '@progress/kendo-ui';
	import Helper from "@/helper.js";
	import { JournalEntryModel } from "@/scripts/model/AppModels";

	const { generalLedgerHandler } = require("@/scripts/AppHandlers");

    export default {
        components:{
			"LoadingMe": () => import('@/components/Loading'),
			'app-searchdate': () => import('@/components/custom_templates/SearchDate'),
		},
        data: () => ({
            startDate: "",
			endDate: "",
            generalLedgerList: [],
            cashIn: 0,
            cashOut: 0,
            cashBalance: 0,
            // Kendo dataSource
			groupDefinition: {
                field: "account.name",
                aggregates: [
                    { field: "dr", aggregate: "sum" },
					{ field: "cr", aggregate: "sum" },
                ],
				compare: function(a, b) {
					if (a.items[0].account.number === b.items[0].account.number) {
						return 0;
					} else if (a.items[0].account.number > b.items[0].account.number) {
						return 1;
					} else {
						return -1;
					}
				}
            },
            aggregateDefinition: [
                { field: "dr", aggregate: "sum" },
				{ field: "cr", aggregate: "sum" },
				{ field: "balance", aggregate: "sum" },
			],
			// LoadingMe
			showLoading : false,
        }),
        methods: {
            // Search
			search () {
				let sdate = this.startDate,
					edate = this.endDate;
				
				if(sdate && edate){
					sdate = kendo.toString(new Date(sdate), 'yyyy-MM-dd') + 'T00:00:00.000Z';

					edate = new Date(edate);
					edate = kendo.toString(edate, 'yyyy-MM-dd') + 'T23:59:59.999Z';
				}else{
					sdate = 0;
					edate = 0;
				}

				// Empty dataSource
				let ds = this.$refs.dataSource.kendoWidget();
				ds.data([]);

				this.showLoading = true;
				generalLedgerHandler.getGeneralLedgerReport({
					params : {
						start_date 		: sdate,
						end_date 		: edate,
						//account_type_code : 0,
						//account_group_uuid : 0,
						//account_uuid 	: 0, 
					}
				})
				.then(res => {
					this.generalLedger = res.data;
					this.bindData();

					if(this.hasQueryString){
						/* Set to default = false */
						this.hasQueryString = false;

						this.filterByAccount();
					}
				})
				.finally(() => {
					this.showLoading = false;
				});
			},
			// Bind Data
			bindData(){
				let entries = [], sumDr = 0, sumCr = 0, cashBalance = 0;
				
				this.generalLedger.forEach(element => {
					let bal = element.openingBalance;
					if (element.account.account_type.nature.toLowerCase() === 'cr') {
						bal = bal * -1;
					}

					element.lines.forEach(value => {
                        // Filter Cash Account Type Only
                        if(value.account.account_type.code < 6){
                            let je = new JournalEntryModel(value);

                            // Balance
                            if (value.account.account_type.nature.toLowerCase() === 'cr') {
                                if (value.exchanged_amount > 0) {
                                    bal = bal - value.exchanged_amount;
                                } else {
                                    bal = bal + (value.exchanged_amount * -1);
                                }
                            } else {
                                bal = bal + value.exchanged_amount;
                            }

                            // Debit / Credit
                            if (value.exchanged_amount > 0) {
                                je.dr = value.exchanged_amount;
                                je.cr = 0;
                            } else {
                                je.dr = 0;
                                je.cr = value.exchanged_amount * -1;
                            }
                            
                            // Sum dr/cr
                            sumDr += je.dr;
                            sumCr += je.cr;

                            // Journal
                            je.journal_uuid = value.journal.uuid;
                            je.journal_type = value.journal.journal_type;
                            je.journal_date = Helper.dateFormat(value.journal.journal_date);
                            je.journal_number = value.journal.number;
                            je.balance = bal;
                            je.openBal = element.openingBalance;

                            entries.push(je);
                        }
					})

                    cashBalance += bal;
				});

                this.cashIn = sumDr;
                this.cashOut = sumCr;
                this.cashBalance = cashBalance;

				// Bind Entries
				this.generalLedgerList = entries;
			},
            // Journal Number Template
			journalNumberTemplate: (dataItem) => {
				return Helper.linkTemplate(dataItem.journal_number, `journal/view/${dataItem.journal_uuid}`);
			},
			// Opening Balance Template
			openBalanceTemplate (data) {
				let openBal = data.items[0].openBal;
				if (data.items[0].account.account_type.nature.toLowerCase() === 'cr') {
					openBal = openBal * -1;
				}
				return '<div class="text-right text-bold text-black">' + kendo.toString(openBal, '#,##0.##;(#,##0.##)') + '</div>'
			},
        },
    };
</script>

<style scoped>
    .k-chart {
        height: 180px;
    }

    .theme--light.v-data-table {
        background-color: transparent !important;
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
        height: 32px !important;
        border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
        border-top: thin solid rgba(0, 0, 0, 0.12) !important;
    }

    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background-color: transparent !important;
    }
</style>