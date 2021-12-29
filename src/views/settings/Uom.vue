<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('uom_full') }}</h2>
            <v-dialog v-model="dialogm2" max-width="400px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" class="rounded-pill text-capitalize white--text float-right" v-on="on"
                           @click="onNewClick">
                        {{ $t('create_new') }}
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>{{ $t('uom_full') }}</v-card-title>
                    <v-icon class="btn_close" @click="dialogm2 = false">close</v-icon>
                    <v-divider/>
                    <v-card-text style="height: 190px; background-color: #EDF1F5; color: #333;">
                        <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                        >
                            <v-row>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label">{{ $t('category') }}</label>
                                    <v-select class="mt-1"
                                              tage="Category"
                                              v-model="mUOMCategory"
                                              :items="uomCategories"
                                              item-value="id"
                                              item-text="name"
                                              :rules="[v => !!v || $t('category_is_required')]"
                                              required
                                              return-object
                                              outlined/>
                                    <label class="label">{{ $t('name') }}</label>
                                    <v-text-field class="mt-1"
                                                  v-model="name"
                                                  outlined
                                                  :rules="[v => !!v || $t('name_is_required'),v => (v && v.length > 2) || $t('character_3')]"
                                                  required
                                                  placeholder=""/>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="pa-5">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn color="black" outlined
                                       class=" text-capitalize rounded-pill black--text float-left"
                                       @click="dialogm2 = false">{{ $t('cancel') }}
                                </v-btn>
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn color="primary" class="px-3 rounded-pill white--text text-capitalize"
                                       @click="onSaveClose">{{ $t('save_close') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

                </v-card>
            </v-dialog>
            <p class="mb-0">{{ $t('categories_desc') }} </p>
        </v-col>


        <v-col sm="12" cols="12">
            <template>
                <v-simple-table class="exchange-table">
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-uppercase">{{ $t('name') }}</th>
                            <th class="text-uppercase">{{ $t('category') }}</th>
                            <th class="text-uppercase">{{ $t('action') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="uom in uoms" v-bind:key="uom.id">
                            <td>{{ uom.name }}</td>
                            <td>{{ uom.category.name }}</td>
                            <td>
                                <v-btn class="btn_edit_setting" @click="onEditClick(uom)">
                                    <v-icon class="white--text" size="14">mdi-pen</v-icon>
                                    <span class="capitalize ml-1 white--text font_14">{{$t('edit')}}</span>
                                </v-btn>
                            </td>
                        </tr>
                        <LoadingMe
                                :isLoading="compeletLoading"
                                :fullPage="false"
                                :myLoading="true"
                                type="loading"/>
                        </tbody>
                    </template>
                </v-simple-table>
            </template>
        </v-col>
    </v-row>
</template>

<script>
    const uomCategoryHandler = require("@/scripts/uomCategoryHandler")
    const uomHandler = require("@/scripts/uomHandler")
    import {i18n} from '@/i18n'

    export default {
        components: {
            LoadingMe: () => import(`@/components/Loading`)
        },
        data: () => ({
            dialogm2: false,
            compeletLoading: true,
            isFullpage: false,
            snackbar: false,
            valid: true,
            textStatus: 'Success',
            color: '#3DA72E',
            timeout: 6000,
            x: 'right',
            y: 'top',
            name: '',
            uomId: '',
            uoms: [],
            uocId: '',
            mUOMCategory: '',
            uomCategories: [],
            headers: [
                {
                    text: i18n.t('name'),
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {text: i18n.t('description'), value: 'description', sortable: false,},
                {text: i18n.t('account_type'), value: 'account_type', sortable: false, align: ' d-none'},
                {text: i18n.t('account_type'), value: 'account_type.name', sortable: false,},
                {text: i18n.t('action'), value: 'actions', sortable: false},
            ],
            option: 1
        }),
        props: {},
        computed: {},
        watch: {
            dialogm2(val) {
                val || this.close()
            },
        },
        created() {
        },
        methods: {
            async onEditClick(value) {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        this.name = value.name
                        this.uomId = value.id
                        this.mUOMCategory = value.category
                        this.uocId = value.category.id
                        this.dialogm2 = true
                    }, 300);
                })
            },
            onNewClick() {
                this.uomId = ''
                this.clear()
            },
            close() {
                this.dialogm2 = false
            },
            clear() {
                this.name = ''

            },
            async onSaveClose() {
                if (!this.$refs.form.validate()) {
                    this.$refs.form.validate()
                    return
                }
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        if (this.uomId === '') {
                            let data = {
                                "name": this.name,
                                "category": this.mUOMCategory
                            }
                            uomHandler.create(data).then(response => {
                                if (response.data.statusCode === 201) {
                                    this.loadUOM()
                                    this.clear()
                                    this.close()
                                    this.$refs.form.resetValidation()
                                    this.$refs.form.reset()
                                }
                            }).catch(e => {
                                this.errors.push(e)
                            })
                        } else {
                            let isCategoryChanged = 1;
                            if (this.uocId === this.mUOMCategory.id) {
                                isCategoryChanged = 0
                            }
                            let data = {
                                "name": this.name,
                                "category": this.mUOMCategory,
                                "isCategoryChanged": isCategoryChanged,
                                "delCategoryId": this.uocId
                            }
                            uomHandler.update(this.uomId, data).then(response => {
                                if (response.data.statusCode === 201) {
                                    this.loadUOM()
                                    this.clear()
                                    this.close()
                                    this.$refs.form.reset()
                                    this.$refs.form.resetValidation()
                                }
                            }).catch(e => {
                                this.errors.push(e)
                            })
                        }
                    }, 300);
                })
            },
            async loadUOC() {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        uomCategoryHandler.get().then(res => {
                            this.compeletLoading = false
                            this.uomCategories = res
                        })
                    }, 300);
                })
            },
            async loadUOM() {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        uomHandler.get().then(res => {
                            this.compeletLoading = false
                            this.uoms = res
                        })
                    }, 300);
                })
            },
        },
        mounted: async function () {
            await this.loadUOC()
            await this.loadUOM()
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

    p {
        color: rgba(0, 0, 0, 0.87);
    }

    .actionBtn {
        height: 47.2px !important;
    }

    .text_tip {
        font-size: 9px;
        line-height: 10px;
    }

    @media (max-width: 576px) {

    }
</style>