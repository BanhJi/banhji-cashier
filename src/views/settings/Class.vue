<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('class_') }}</h2>
            <v-dialog v-model="dialogM2" max-width="380px">
                <!--                <template v-slot:activator="{ on }">-->
                <!--                    <v-btn color="primary" class="rounded-pill text-capitalize white&#45;&#45;text float-right" v-on="on">-->
                <!--                        {{ $t('add_class') }}-->
                <!--                    </v-btn>-->
                <!--                </template>-->
                <v-card>
                    <v-card-title>{{ $t('class_') }}</v-card-title>
                    <v-icon class="btn_close" @click="dialogM2 = false">close</v-icon>
                    <v-divider/>
                    <v-card-text style="height: 170px; background-color: #EDF1F5; color: #333;">
                        <v-row>
                            <v-col sm="12" cols="12" class="">
                                <v-row>
                                    <v-col sm="4" class="pt-0 pr-0">
                                        <p class="label font_16 mb-0">{{ $t('class_no') }}:</p>
                                    </v-col>
                                    <v-col sm="6" class="pt-0 pl-0">
                                        <h3 class="text-bold">{{ clazz.code }}</h3>
                                    </v-col>
                                    <v-col sm="2" class="pt-0 pl-0">
                                        <input
                                            type="checkbox"
                                            v-model="clazz.isShow"
                                            true-value="true"
                                            false-value="false"
                                        />
                                    </v-col>

                                </v-row>

                                <label class="label">{{ $t('name') }}</label>
                                <v-text-field class="mt-1"
                                              outlined
                                              v-model="clazz.name"
                                              id="Class Name"
                                              placeholder="Class "/>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="pa-5">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn
                                    color="black"
                                    outlined
                                    class=" text-capitalize rounded-pill black--text float-left"
                                    @click="dialogM2 = false"
                                >{{ $t("cancel") }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn @click="onSaveClose" :disabled="btnEnable"
                                       color="primary"
                                       class="px-3 rounded-pill white--text text-capitalize"
                                >{{ $t("save_close") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>
            <p class="mb-0">
                {{ $t('class_func_setting_desc') }}
            </p>
        </v-col>
        <v-col sm="12" cols="12">
            <template>
                <div v-if="!isLoaded">
                    <LoadingMe
                        :isLoading="showLoading"
                        :fullPage="false"
                        :myLoading="true"
                        type="loading"/>
                </div>
                <kendo-datasource ref="clazzDS"
                                  :data="clazzes"
                                  :schema="schemaDefinition"/>
                <kendo-grid id="gridClazzes" class="grid-function" ref="gridComponent"
                            :data-source-ref="'clazzDS'"
                            :pageable="true"
                            :editable="'inline'"
                            v-on:detailinit="detailInit"
                            v-on:databound="dataBound"
                            v-on:@change="onRowChanged"
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
                        :field="'code'"
                        :title="$t('code')"
                        :width="50"
                        :template="'<span>#=code#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="'name'"
                        :attributes="{class:'tb_name_td'}"
                        :title="$t('name')"
                        :width="90"
                        :template="'<span>#=name#</span>'"
                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                    <kendo-grid-column
                        :field="''"
                        :title="$t('action')"
                        :width="70"
                        :command="[{ iconClass: 'k-icon k-i-edit', text: 'Edit', click: goEdit },{ iconClass: 'k-icon k-i-edit', text: 'Sub Of', click: AddSubClass }]"
                        :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
                </kendo-grid>
            </template>


        </v-col>
        <v-dialog v-model="dialogM3" max-width="450px" eager>
            <v-card>
                <v-card-title>{{ $t('sub_class') }}</v-card-title>
                <v-icon class="btn_close" @click="dialogM3 = false">close</v-icon>
                <v-divider/>
                <v-card-text style="height: 300px; background-color: #EDF1F5; color: #333;">
                    <v-row>
                        <v-col sm="6" cols="12" class="pb-0">
                            <label class="label">{{ $t('class_') }}</label>
                            <v-select class="mt-1"
                                      v-model="subClazz.clazz"
                                      :items="clazzes"
                                      item-value="id"
                                      :item-text="item =>`${item.code} - ${item.name}`"
                                      tage="Class"
                                      return-object
                                      placeholder="Class"
                                      outlined
                            />
                            <label class="label">{{ $t('name') }}</label>
                            <v-text-field class="mt-1"
                                          outlined
                                          v-model="subClazz.name"
                                          :placeholder="$t('name')"/>
                        </v-col>
                        <v-col sm="6" cols="12" class="pb-0">
                            <label class="label">{{ $t('sub_of') }}</label>
                            <v-select class="mt-1"
                                      outlined
                                      :items="subClazzes"
                                      v-model="subClazz.subOf"
                                      item-value="id"
                                      :item-text="item =>`${item.code} - ${item.name}`"
                                      return-object
                                      dense/>

                            <label class="label">{{ $t('code') }}</label>
                            <v-text-field class="mt-1"
                                          outlined
                                          v-model="subClazz.code"
                                          :placeholder="$t('code')"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="12" cols="12" class="py-0">
                            <label class="label">{{ $t('description') }}</label>
                            <v-textarea
                                class="mt-1"
                                v-model="subClazz.description"
                                no-resize
                                height="80px"
                                outlined
                                rows="4"
                                :placeholder="$t('description')"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider/>
                <v-card-actions class="pa-5">
                    <v-row>
                        <v-col sm="6" cols="6" class="py-0 text-left">
                            <v-btn
                                color="black"
                                outlined
                                class=" text-capitalize rounded-pill black--text float-left"
                                @click="dialogM3 = false"
                            >{{ $t("cancel") }}
                            </v-btn>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-0 text-right">
                            <v-btn @click="onSubClassSaveClose" :disabled="btnEnable"
                                   color="primary"
                                   class="px-3 rounded-pill white--text text-capitalize"
                            >{{ $t("save_close") }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import ClazzModel from "@/scripts/model/Clazz";
import SubClazzModel from "@/scripts/model/SubClazz";
import kendo from "@progress/kendo-ui";

const classModel = new ClazzModel({})
const subClassModel = new SubClazzModel({})
const $ = require("jquery")
const settingsHandler = require("@/scripts/settingsHandler")
export default {
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        dialogM2: false,
        dialogM3: false,
        showLoading: true,
        isLoaded: false,
        hidden: false,
        clazzes: [],
        subClazzes: [],
        mClass: {},
        clazz: classModel,
        subClazz: subClassModel,
        schemaDefinition: {
            model: {id: "id"}
        },
        btnEnable: false
    }),
    props: {},
    computed: {
        dialogM4: function () {
            return this.dialogM3
        }
    },
    mounted: async function () {
        await this.loadClass()
    },
    methods: {
        onRowChanged(dataItem) {
            window.console.log('sub ', dataItem)
        },
        detailInit: function (e) {
            kendo.jQuery('<div />').appendTo(e.detailCell).kendoGrid({
                dataSource: {
                    dataType: 'json',
                    transport: {
                        read: settingsHandler.byClassURL() + e.data.id
                    },
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    filter: {
                        field: 'id',
                        operator: 'eq',
                        value: e.data.id
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "string"},
                                code: {type: "string"},
                                name: {type: "string"},
                                description: {type: "string"},
                                clazz: {type: "Object"},
                                subOf: {type: "Object"}
                            }
                        },
                        data: function (response) {
                            return response.data;
                        },
                        total: function (response) {
                            return response.data.count;
                        }
                    }
                },
                scrollable: false,
                sortable: true,
                pageable: true,
                editable: "popup",
                columns: [
                    {
                        field: 'code',
                        title: 'Code',
                        width: '110px'
                    },
                    {
                        field: 'name',
                        title: 'Name'
                    },
                    {
                        field: 'description',
                        title: 'Description',
                        width: '300px'
                    },
                    {
                        field: 'clazz.id',
                        title: ' ',
                        width: '0px'
                    },
                    {
                        field: 'subOf.id',
                        title: 'Sub Of',
                        hidden: 'true',
                        width: '100px'
                    },
                    {
                        field: '',
                        title: 'Action',
                        command: [
                            // {
                            //     iconClass: "k-icon k-i-edit", text: "Edit Sub", click: function (e) {
                            //         e.preventDefault();
                            //         let tr = $(e.target).closest("tr")
                            //         let data = this.dataItem(tr)
                            //         // this.goEditSub(data)
                            //         this.subClazz = data
                            //         window.console.log('data', this.dialogM4)
                            //     }
                            // },
                            {
                                iconClass: "k-icon k-i-edit", text: "Edit Sub", click: this.goSubEdit
                            }
                        ],

                    }
                ]
            })
        },
        dataBound: function (ev) {
            window.console.log(ev)
            // ev.sender.expandRow(ev.sender.tbody.find('tr.k-master-row').first())
        },
        close() {
            this.dialogM2 = false;
            this.dialogM3 = false;
        },
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#gridClazzes").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.clazz = dataItem
            this.dialogM2 = true
        },
        goSubEdit: function (e) {
            e.preventDefault();
            let tr = $(e.target).closest('tr')
            let innerText = tr[0]['innerText']
            let cell = innerText.split('\t')
            this.subClazz.code = cell[0]
            this.subClazz.name = cell[1]
            this.subClazz.description = cell[2]

            const clazz = this.clazzes.filter(m => m.id === cell[3])
            // const subOf = this.clazzes.filter(m => m.id === cell[4])
            if (cell[4] === '') {
                this.subClazz.subOf = {}
            } else {
                this.subClazz.subOf = cell[4]
            }
            this.subClazz.clazz = clazz[0]
            window.console.log(this.subClazz.clazz, 'Log')
            // let str = value[0].split('\n')
            // let textVal = ''
            // tr.find('td').each(function (i, r) {
            //     textVal += `Col ${i + 1}: ${r.innerText}\n`;
            // });
            // tr[0].forEach(c => {
            //     window.console.log(c)
            // })
            // let data = gridWidget.dataItem(tr)
            // let data = tr.split(' ')
            this.dialogM3 = true
        },
        showDetail: function (data) {
            alert(data.code)
        },
        goEditSub: function (data) {
            // e.preventDefault()
            // let grid = kendo.jQuery("#gridClazzes").data("kendoGrid")
            // let gridWidget = grid.dataItem()
            // let tr = $(e.target).closest('tr')
            // let data = gridWidget.dataItem(tr)
            this.subClazz = data
            this.dialogM3 = true
            // window.console.log(data)

        },
        AddSubClass() {
            this.dialogM3 = true
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.clazzDS.kendoWidget(),
                index = ds.indexOf(dataItem)
            return index + 1
        },
        async loadClass() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.clazzes = []
                    settingsHandler.getClazz().then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.clazzes = res.data.data
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
        async onSaveClose() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        "id": this.clazz.id ? this.clazz.id : '',
                        "name": this.clazz.name,
                        "code": this.clazz.code,
                        "isShow": this.clazz.isShow,
                        "isSystem": this.clazz.isSystem
                    }
                    this.btnEnable = true
                    settingsHandler.create(data).then(response => {
                        if (response.data.statusCode === 201) {
                            const res = response.data.data
                            const index = this.clazzes.findIndex(item => {
                                return (res.id === item.id)
                            })
                            if (this.clazzes.length === 0) {
                                this.loadClass()
                            } else {
                                if (index < 0) {
                                    this.clazzes.push(res)
                                } else {
                                    this.clazzes.splice(index, 1, res)
                                }
                            }
                            this.btnEnable = false
                            this.$snotify.success('Success')
                            this.close()
                        }
                    }).catch(e => {
                        this.btnEnable = false
                        this.$snotify.error('Something went wrong')
                        this.errors.push(e)
                    })
                }, 300);
            })
        },
        async onSubClassSaveClose() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        "id": this.subClazz.id ? this.subClazz.id : '',
                        "name": this.subClazz.name,
                        "code": this.subClazz.code,
                        "description": this.subClazz.description,
                        "subOf": this.subClazz.subOf,
                        "clazz": this.subClazz.clazz,
                        "isSystem": this.subClazz.isSystem
                    }
                    this.btnEnable = true
                    settingsHandler.createSubClass(data).then(response => {
                        if (response.data.statusCode === 201) {
                            const res = response.data.data
                            const index = this.subClazzes.findIndex(item => {
                                return (res.id === item.id)
                            })
                            if (this.subClazzes.length === 0) {
                                // this.loadClass()
                            } else {
                                if (index < 0) {
                                    this.subClazzes.push(res)
                                } else {
                                    this.subClazzes.splice(index, 1, res)
                                }
                            }
                            this.btnEnable = false
                            this.$snotify.success('Success')
                            this.close()
                        }
                    }).catch(e => {
                        this.btnEnable = false
                        this.$snotify.error('Something went wrong')
                        this.errors.push(e)
                    })
                }, 300);
            })
        },
    }
};
</script>
<style scoped>
.acc_group header {
    height: 10px !important;
}

table.acc_group tr td {
    border-bottom: 1px solid #ccc;
    padding: 8px;
    vertical-align: middle;
}

table.acc_group tr td:first-child {
    font-weight: 700;
}

table.acc_group tr td:last-child {
    text-align: center;
}

.v-card__actions .v-btn.v-btn {
    padding: 0 16px;
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

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:last-child td {
    border-bottom: 1px solid #000 !important;
}

.function_footer {
    padding: 15px;
    display: inline-block;
}

@media (max-width: 576px) {

}
</style>