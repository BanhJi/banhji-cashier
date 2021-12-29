<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('business_unit_location') }}</h2>
            <v-dialog v-model="dialogM2" max-width="380px">
                <template v-slot:activator="{ on }">
                    <v-btn @click="onNewClick" color="primary"
                           class="rounded-pill text-capitalize white--text float-right" v-on="on">
                        {{ $t('create_new') }}
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ $t('location') }}</v-card-title>
                    <v-icon class="btn_close" @click="dialogM2 = false">close</v-icon>
                    <v-divider/>
                    <v-card-text style="height: 310px; background-color: #EDF1F5; color: #333;">
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col sm="12" cols="12" class="">
                                    <label class="label">{{ $t('code') }}</label>
                                    <v-text-field class="mt-1"
                                        outlined
                                        v-model="location.code"
                                        tage="Discount Rate"
                                        placeholder=""
                                        :rules="[v => !!v || $t('location_code_require')]"
                                    />
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                        outlined
                                        v-model="location.name"
                                        placeholder=""
                                        :rules="[v => !!v || $t('location_name_require')]"
                                    />
                                    <label class="label">{{ $t('address') }}</label>
                                    <v-textarea class="mt-1" no-resize height="90px"
                                        outlined
                                        v-model="location.address"
                                        clearable
                                        rows="3"/>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="pa-5">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn
                                    color="black"
                                    outlined
                                    class=" text-capitalize rounded-pill black--text float-left"
                                    @click="dialogM2 = false">{{ $t("cancel") }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn @click="onSaveClose"
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
                {{ $t('bu_location_setting_desc') }}
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
                <kendo-datasource ref="locationDS"
                                  :data="locations"
                                  :schema="schemaDefinition"/>
                <kendo-grid id="gridLocation" class="grid-function"
                            :data-source-ref="'locationDS'"
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
                        :field="'address'"
                        :title="$t('address')"
                        :width="90"
                        :template="'<span>#=address#</span>'"
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
import LocationModel from "@/scripts/model/Location"
import kendo from "@progress/kendo-ui";

const $ = require("jquery")
const locationHandler = require("@/scripts/locationHandler")
const locationModel = new LocationModel({})

export default {
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        dialogM2: false,
        valid:  true,
        showLoading: true,
        isLoaded: false,
        locations: [],
        mLocation: {},
        location: locationModel,
        schemaDefinition: {
            model: {id: "id"}
        },
        btnEnable: false
    }),
    mounted: async function () {
        await this.loadLocation()
    },
    methods: {
        onNewClick() {
            this.location = {}
            this.mLocation = {}
            this.dialogM2 = true
        },
        close() {
            this.dialogM2 = false
        },
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#gridLocation").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.location = dataItem
            // this.mLocation = this.location.address
            this.dialogM2 = true
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.locationDS.kendoWidget(),
                index = ds.indexOf(dataItem)
            return index + 1
        },
        async loadLocation() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.locations = []
                    locationHandler.list().then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.locations = res.data.data
                            // this.segmentList = res.data.data
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
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
                        "id": this.location.id ? this.location.id : '',
                        "name": this.location.name,
                        "code": this.location.code,
                        "address": this.location.address
                    }
                    this.btnEnable = true
                    locationHandler.create(data).then(response => {
                        if (response.data.statusCode === 201) {
                            const res = response.data.data
                            const index = this.locations.findIndex(item => {
                                return (res.id === item.id)
                            })
                            if (this.locations.length === 0) {
                                this.loadLocation()
                            } else {
                                if (index < 0) {
                                    this.locations.push(res)
                                } else {
                                    this.locations.splice(index, 1, res)
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