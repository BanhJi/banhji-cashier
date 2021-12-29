<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('account_prefix_setting') }}</h2>
            <v-dialog v-model="dialog" scrollable max-width="700px">
                <v-card>
                    <v-card-title>{{ $t('transaction_prefix') }}</v-card-title>
                    <v-icon class="btn_close" @click="dialog = false">close</v-icon>
                    <v-divider/>
                    <v-card-text style="height: 410px; background-color: #EDF1F5; color: #333;">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-row>
                                <v-col sm="6" cols="12" class="">
                                    <label class="label">{{ $t('transaction_type') }}</label>
                                    <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_1') }}</p>
                                    <v-text-field class=" mb-3" v-bind:value="prefix.name"
                                                  outlined
                                                  tage="Transaction Type"
                                                  readonly
                                                  placeholder=""
                                    />
                                    <label class="label">{{ $t('transaction_prefix') }}</label>
                                    <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_2') }}</p>
                                    <v-row>
                                        <v-col sm="6" cols="12" class="py-0">
                                            <v-text-field class="mt-1" v-bind:value="prefix.abbr"
                                                          v-model="prefix.abbr"
                                                          outlined
                                                          tage="Transaction Prefix"
                                                          :rules="[v => !!v || $t('abb_is_required')]"
                                                          required
                                                          @change="onNumberingStructureChange"
                                                          placeholder=""
                                            />
                                        </v-col>
                                        <v-col sm="6" cols="12" class="py-0">
                                            <v-select class="mt-1"
                                                      v-model="prefix.prefixSeparator"
                                                      @change="onNumberingStructureChange"
                                                      :items="separator"
                                                      tage="Separator"
                                                      placeholder="separator"
                                                      outlined
                                            />
                                        </v-col>
                                    </v-row>
                                    <label class="label">{{ $t('starting_number') }}</label>
                                    <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_3') }}</p>
                                    <v-text-field class=" mb-3" type="number"
                                                  v-model="prefix.number"
                                                  @keypress="onlyNumber" @input="onlyNumber"
                                                  outlined
                                                  tage="Starting Number"
                                                  min="1"
                                                  placeholder=""
                                    />

                                    <v-row>
                                        <v-col sm="6" cols="12" class="py-0">
                                            <label class="label">{{ $t('format') }}</label>
                                            <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_4') }}</p>
                                            <v-text-field class="" type="number"
                                                          v-model="prefix.format"
                                                          @change="onNumberingStructureChange"
                                                          outlined
                                                          tage="Format"
                                                          min="3"
                                                          max="10"
                                                          placeholder=""/>
                                        </v-col>
                                        <v-col sm="6" cols="12" class="pt-5">
                                            <label class="label">{{ $t('separator') }}</label>
                                            <v-select class="mt-1"
                                                      v-model="prefix.numberSeparator"
                                                      @change="onNumberingStructureChange"
                                                      :items="separator"
                                                      tage="Separator"
                                                      placeholder="separator"
                                                      outlined
                                            />
                                        </v-col>
                                    </v-row>


                                </v-col>
                                <v-col sm="6" cols="12" class="">
                                    <label class="label">{{ $t('numbering_structure') }}</label>
                                    <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_5') }}</p>
                                    <v-row>
                                        <v-radio-group v-model="prefix.sequence" :mandatory="false"
                                                       @change="onNumberingStructureChange">
                                            <v-col sm="3" cols="2" class="pa-0 ml-2 mb-3" style="line-height: 40px;">
                                                <v-radio :label="$t('year')+'(yyyy)'" :value=0 color="blue"/>
                                            </v-col>
                                            <v-col sm="3" cols="2" class="pa-0 ml-2 mb-3" style="line-height: 40px;">
                                                <v-radio :label="$t('year')+'(yy)'" :value=1 color="blue"/>
                                            </v-col>
                                            <v-col sm="3" cols="4" class="pa-0 ml-2 mb-3" style="line-height: 40px;">
                                                <v-radio :label="$t('year/month')+'(yyyymm)'" :value=2 color="blue"/>
                                            </v-col>
                                            <v-col sm="3" cols="4" class="pa-0 ml-2 mb-3" style="line-height: 40px;">
                                                <v-radio :label="$t('year/month')+'(yymm)'" :value=3 color="blue"/>
                                            </v-col>
                                            <v-col sm="3" cols="4" class="pa-0 ml-2 mb-3" style="line-height: 40px;">
                                                <v-radio :label="$t('none')" :value=4 color="blue"/>
                                            </v-col>
                                        </v-radio-group>
                                    </v-row>

                                    <label class="label">{{ $t('sequencing_by') }}</label>
                                    <p class="text_tip">{{ $t('sequencing_by_desc') }}</p>
                                    <v-select class="mt-1"
                                              v-model="prefix.sequcencing"
                                              @change="onNumberingStructureChange"
                                              :items="sequencing"
                                              tage="sequencing"
                                              placeholder="Month"
                                              outlined
                                    />

                                    <label class="label">{{ $t('preview') }}</label>
                                    <p class="text_tip">{{ $t('acc_trans_setting_dialog_desc_6') }}</p>
                                    <v-text-field class=""
                                                  outlined
                                                  tage="Preview"
                                                  v-model="preview"
                                                  placeholder=""
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="function_footer">
                        <v-btn class="btn_cancel float-left" @click="dialog = false">{{ $t('cancel') }}</v-btn>
                        <v-btn class="btn_save_close float-right" @click="onSaveClose">{{ $t('save_close') }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <p class="mb-3">{{ $t('acc_prefix_setting_desc') }}</p>

            <template>
                <LoadingMe
                    :isLoading="compeletLoading"
                    :fullPage="false"
                    :myLoading="true"
                    type="loading"/>
                <kendo-datasource ref="gridPrefixeDS"
                                  :data="prefixList"/>
                <kendo-grid id="gridPrefixes" class="grid-function"
                            :data-source-ref="'gridPrefixeDS'"
                            :editable="false"
                            :scrollable-virtual="true">
                    <kendo-grid-column
                        :field="'no'"
                        :title="$t('no')"
                        :template="rowNumberTmpl"
                        :width="40"
                        :column-menu="false"
                        :headerAttributes="{ style: 'background-color: #EDF1F5;', class: 'text-center'	}"
                        :attributes="{style: 'text-align: center'}"/>
                    <kendo-grid-column
                        :field="'abbr'"
                        :title="$t('abbr')"
                        :width="50"
                        :template="'<span>#=abbr#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'name'"
                        :attributes="{class:'tb_name_td'}"
                        :title="$t('name')"
                        :width="90"
                        :template="'<span>#=name#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'format'"
                        :title="$t('format')"
                        :width="60"
                        :template="'<span>#=format#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'structure'"
                        :title="$t('structure')"
                        :width="90"
                        :template="'<span>#=structure#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'sequcencing'"
                        :title="$t('sequencing')"
                        :width="90"
                        :template="'<span>#=sequcencing#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'suffix'"
                        :title="$t('preview')"
                        :width="120"
                        :template="prefixPreview"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'function'"
                        :title="$t('function')"
                        :width="80"
                        :template="'<span>#=function_#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="''"
                        :title="$t('action')"
                        :width="70"
                        :command="[{ iconClass: 'k-icon k-i-edit', text: 'Edit', click: goEdit }]"
                        :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
                </kendo-grid>
            </template>
        </v-col>
    </v-row>
</template>

<script>
import PrefixModel from "@/scripts/model/Prefix"
import kendo from "@progress/kendo-ui";

const $ = require("jquery")
const prefixHandler = require("@/scripts/prefixHandler.js")
const settingsHandler = require("@/scripts/settingsHandler")
const prefixModel = new PrefixModel({})

export default {
    components: {
        LoadingMe: () => import(`@/components/Loading`)
    },
    data() {
        return {
            dialog: false,
            compeletLoading: true,
            valid: true,
            prefixList: [],
            prefix: prefixModel,
            separator: ['-', '/', ''],
            sequencing: ['Month', 'Year', 'Prefix'],
            preview: ''
        }
    },
    props: {},
    methods: {
        prefixPreview(dataItem) {
            const year = new Date().getFullYear()
            const shortMonth = ("0" + (new Date().getMonth() + 1)).slice(-2)
            if (dataItem.sequence === 0) {
                dataItem.suffix = year
            } else if (dataItem.sequence === 1) {
                dataItem.suffix = year.toString().substr(2)
            } else if (dataItem.sequence === 2) {
                dataItem.suffix = year + shortMonth
            } else if (dataItem.sequence === 3) {
                dataItem.suffix = year.toString().substr(2) + shortMonth
            }
            const preview = dataItem.abbr + dataItem.prefixSeparator + dataItem.suffix + dataItem.numberSeparator + '0'.repeat(dataItem.format - dataItem.number.toString().length) + dataItem.number
            return `<span>${preview}</span>`
        },
        prefixStructure(dataItem) {
            const year = new Date().getFullYear()
            const shortMonth = ("0" + (new Date().getMonth() + 1)).slice(-2)
            let structure = ' (yyyy)'
            if (dataItem.sequence === 0) {
                dataItem.suffix = year
                structure = ' (yyyy)'
            } else if (dataItem.sequence === 1) {
                dataItem.suffix = year.toString().substr(2)
                structure = ' (yy)'
            } else if (dataItem.sequence === 2) {
                dataItem.suffix = year + shortMonth
                structure = ' (yyyymm)'
            } else if (dataItem.sequence === 3) {
                dataItem.suffix = year.toString().substr(2) + shortMonth
                structure = ' (yymm)'
            }

            return `<span>${dataItem.suffix + structure}</span>`
        },
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#gridPrefixes").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.prefix = dataItem
            window.console.log(dataItem)
            this.onNumberingStructureChange()
            this.dialog = true
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.gridPrefixeDS.kendoWidget(),
                index = ds.indexOf(dataItem)
            return index + 1
        },
        async onSaveClose() {
            if (!this.$refs.form.validate()) {
                this.$refs.form.validate()
                return
            }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        "id": this.prefix.id ? this.prefix.id : '',
                        "abbr": this.prefix.abbr,
                        "name": this.prefix.name,
                        "number": this.prefix.number,
                        "format": this.prefix.format,
                        "sequence": this.prefix.sequence,
                        "suffix": this.prefix.suffix,
                        "structure": this.prefix.structure,
                        "prefixSeparator": this.prefix.prefixSeparator,
                        "numberSeparator": this.prefix.numberSeparator,
                        "sequencing": this.prefix.sequencing,
                        "preview": this.prefix.preview,
                        "type": this.prefix.type,
                        "function_": this.prefix.function_,
                        "module_": this.prefix.module_,
                    }
                    prefixHandler.create(data).then(response => {
                        if (response.data.statusCode === 201) {
                            this.dialog = false
                            this.loadPrefixes()
                            this.$snotify.success('Update Prefix successfully')
                        }
                    }).catch(e => {
                        this.$snotify.error('Something went wrong on update')
                        this.errors.push(e)
                    })
                }, 300);
            })
        },
        async onNumberingStructureChange() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    //eslint-disable-next-line no-console
                    window.console.log(this.prefix.prefixSeparator)
                    let year = new Date().getFullYear()
                    let shortMonth = ("0" + (new Date().getMonth() + 1)).slice(-2)
                    if (this.prefix.sequence === 0) {
                        this.prefix.suffix = year
                    } else if (this.prefix.sequence === 1) {
                        this.prefix.suffix = year.toString().substr(2)
                    } else if (this.prefix.sequence === 2) {
                        this.prefix.suffix = year + shortMonth
                    } else if (this.prefix.sequence === 3) {
                        this.prefix.suffix = year.toString().substr(2) + shortMonth
                    } else if (this.prefix.sequence === 4) {
                        this.prefix.suffix = ""
                    }
                    this.prefix.preview = this.prefix.abbr + this.prefix.prefixSeparator +
                        this.prefix.suffix + this.prefix.numberSeparator + '0'.repeat(this.prefix.format - this.prefix.number.toString().length) + this.prefix.number
                    this.preview = this.prefix.preview
                    window.console.log(this.prefix.preview)
                }, 300)
            })
        },
        async loadPrefixes() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    settingsHandler.getPrefixes().then(res => {
                        if (res.data.statusCode === 200) {

                            this.prefixList = res.data.data
                        }
                        this.compeletLoading = false
                    })
                }, 300)
            })
        },
        onlyNumber($event) {
            //console.log($event.keyCode); //keyCodes value
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57)) { // 46 is dot
                $event.preventDefault();
            } else {
                this.onNumberingStructureChange()
            }

        },
    },
    mounted: async function () {
        await this.loadPrefixes()
    }
};
</script>
<style scoped>
table.acc_prefix_Setting {
    border-top: 1px solid #ccc;
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    color: #000;
}

table.acc_prefix_Setting tr th {
    text-transform: uppercase;
    padding: 10px;
    border-top: 1px solid #ccc;
    border-bottom: 3px solid #ccc;
    vertical-align: top;

}

table.acc_prefix_Setting tr td {
    border-bottom: 1px solid #ccc;
    padding: 3px 0;
    vertical-align: middle;
    font-size: 13px;
}

table.acc_prefix_Setting tr td:first-child {
    font-weight: 700;
}

table.acc_prefix_Setting tr td:last-child {
    text-align: center;
}

.v-card__actions .v-btn.v-btn {
    padding: 0 16px;
}

.function_footer {
    padding: 15px;
    display: inline-block;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Krasar-Bold', serif;
    color: #000 !important;
    border-top: 1px solid #000 !important;
    border-bottom: 1px solid #000 !important;
    font-size: 15px !important;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
    color: #000 !important;
    padding: 5px !important;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td:not(.v-data-table__mobile-row) {


    border-bottom: 0;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:last-child td {
    border-bottom: 1px solid #000 !important;
}

@media (max-width: 576px) {

}
</style>