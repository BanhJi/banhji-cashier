<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-card
                        outlined
                        dense
                        class="pa-4 no_border rounded-sm"
                        color="white">
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-card outlined dense class="no_border">
                                <h2 class="mb-0">{{ $t("services_non") }}</h2>
                                <v-icon
                                    @click="cancel()"
                                    style="cursor: pointer; color: #333; font-size: 40px;"
                                    class="float-right"
                                >close
                                </v-icon>
                            </v-card>
                            <v-card outlined dense class="px-3 no_border" color="grayBg">
                                <v-row>
                                    <v-col sm="4" cols="12" class="pb-0">
                                        <label class="label  mb-0">{{ $t("category") }}</label>
                                        <v-select
                                            class="mt-1"
                                            tage="Service Category"
                                            :placeholder="$t('select_type')"
                                            outlined
                                            v-model="mCategory"
                                            :items="categories"
                                            item-value="id"
                                            :item-text="(item) => `${item.abbr} - ${item.name}`"
                                            @change="onCategoryChanged"
                                            return-object
                                            :rules="[(v) => !!v || 'Number is required']"
                                            required/>
                                        <label class="label  mb-0">{{ $t("group") }}</label>
                                        <v-select
                                            class="mt-1"
                                            tage="Product Group"
                                            :placeholder="$t('select_grou')"
                                            outlined
                                            v-model="mGroup"
                                            :items="groups"
                                            @change="loadSubGroup(mGroup)"
                                            item-value="id"
                                            :item-text="(item) => `${item.abbr} - ${item.name}`"
                                            return-object
                                        />
                                        <label class="label  mb-0">{{ $t("sub_group") }}</label>
                                        <v-select
                                            class="mt-1"
                                            :placeholder="$t('select_sub_group')"
                                            outlined
                                            tage="Sub Group"
                                            v-model="mSubGroup"
                                            :items="subGroups"
                                            item-value="id"
                                            return-object
                                            :item-text="(item) => `${item.abbr} - ${item.name}`"
                                            required
                                        />
                                    </v-col>
                                    <v-col sm="4" cols="12" class="pl-0">
                                        <label class="label mb-0 mt-1 mx-1">{{ $t("code") }}</label>
                                        <v-row class="mt-1 mr-0">
                                            <v-col sm="10" cols="10" class="pt-0 py-0 pr-1">
                                                <v-text-field
                                                    class=""
                                                    v-model="service.sku"
                                                    outlined
                                                    :rules="[(v) => !!v || 'Number is required']"
                                                    required
                                                />
                                            </v-col>
                                            <v-col sm="2" cols="2" class="pt-0 py-0 px-0">
                                                <v-icon
                                                    color="black"
                                                    size="30"
                                                    class="border_qrcode"
                                                    @click="skuGenerator"
                                                >mdi-qrcode
                                                </v-icon>
                                            </v-col>
                                        </v-row>
                                        <label class="label  mb-0">{{ $t("service_name") }}</label>
                                        <v-text-field
                                            class="pt-1"
                                            outlined
                                            tage="Service Name"
                                            v-model="service.name"
                                            :rules="[(v) => !!v || 'Name is required']"
                                            required
                                        />
                                    </v-col>
                                    <v-col sm="4" cols="12" class="my_checkbox">
                                        <h2 class="font_20 mb-0">
                                            {{ $t("description") }}
                                        </h2>
                                        <p class="grayBg---text mb-0 font_12">
                                            {{ $t("this_will_be_used") }}
                                        </p>
                                        <v-textarea
                                            class="mt-1"
                                            outlined
                                            v-model="service.saleDescription"
                                            no-resize
                                            height="100px"
                                            rows="6"
                                        />
                                        <!--                                        <v-row>-->
                                        <!--                                            <v-col sm="6" cols="12" class="py-0">-->
                                        <!--                                                <div class="my_radio py-0">-->
                                        <!--                                                    <input id="radio1" name="radio" type="radio" value=1>-->
                                        <!--                                                    <label for="radio1">{{ $t('delayed_revenue') }}</label>-->
                                        <!--                                                </div>-->
                                        <!--                                            </v-col>-->
                                        <!--                                            <v-col sm="6" cols="12" class="py-0">-->
                                        <!--                                                <div class="my_radio py-0">-->
                                        <!--                                                    <input id="radio2" name="radio" type="radio" value=2>-->
                                        <!--                                                    <label for="radio2">{{ $t('consignment_item') }}</label>-->
                                        <!--                                                </div>-->
                                        <!--                                            </v-col>-->


                                        <!--                                        </v-row>-->

                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-card outlined dense class="px-3 my-4 rounded-0">
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <p class="grayBg---text font_14 mb-0">
                                            {{ $t("you_can_add_more") }}
                                        </p>
                                    </v-col>
                                    <v-col sm="4" cols="12" class="pb-0 pt-2">
                                        <v-row>
                                            <v-col sm="4" cols="12" class="pt-2">
                                                <label>{{ $t("price_level") }}</label>
                                            </v-col>
                                            <v-col sm="8" cols="12" class="pl-0 py-0">
                                                <v-select :placeholder="$t('price_level')"
                                                    outlined
                                                    tage="price level"
                                                    :rules="[v => !!v['id'] || 'Number is required']"
                                                    v-model="service.priceLevel"
                                                    :items="priceLevel"
                                                    @change="priceLevelChanged"
                                                    item-value="id"
                                                    item-text="name"
                                                    return-object
                                                    required/>
                                            </v-col>
                                        </v-row>
                                    </v-col>

                                    <v-col sm="4" cols="12" class="pb-0 pt-2">
                                        <v-row>
                                            <v-col sm="4" cols="12" class="pt-2">
                                                <label>{{ $t("uom") }}</label>
                                            </v-col>
                                            <v-col sm="8" cols="12" class="pl-0 py-0">
                                                <v-select
                                                    :placeholder="$t('select_uom')"
                                                    outlined
                                                    tage="Sale Base Uom"
                                                    v-model="mUOM"
                                                    :items="uom"
                                                    item-value="id"
                                                    :item-text="(item) => `${item.name}`"
                                                    return-object
                                                    :rules="[(v) => !!v['id'] || 'UOM is required']"
                                                    required
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col sm="4" cols="12" class="pb-0 pt-2">
                                        <v-row>
                                            <v-col sm="3" cols="12" class="pt-2">
                                                <label>{{ $t("price") }}</label>
                                            </v-col>
                                            <v-col sm="9" cols="12" class="py-0">
                                                <v-row>
                                                    <v-col sm="4" cols="3" class="pt-0 pr-0">
                                                        <div class="code_text text-bold">{{ code }}</div>
                                                    </v-col>
                                                    <v-col sm="8" cols="9" class="py-0 pl-0 pr-1">
                                                        <v-text-field class="custom-border"
                                                            outlined
                                                            type="number"
                                                            tage="Price"
                                                            v-model="service.price"
                                                            clearable/>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-card outlined dense class="px-3 my-4 rounded-0">
                                <v-row>
                                    <!-- <v-col sm="5" cols="12" class="pb-0">
                                        <h2 class="font_20 mb-0">
                                            {{ $t("account_tax") }}
                                        </h2>
                                        <p class="mb-3 color_grey">
                                            {{ $t("add_funct_prod_desc") }}
                                        </p>
                                        <v-row>
                                            <v-col sm="12" cols="12 py-0">
                                                <label class="label mb-0">{{ $t("revenue") }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    :placeholder="$t('revenue')"
                                                    tage="Revenue"
                                                    v-model="mIncomeAcc"
                                                    :items="accRevenue"
                                                    item-value="id"
                                                    :item-text="(item) => `${item.number} - ${item.name}`"
                                                    :rules="[(v) => !!v['id'] || 'Number is required']"
                                                    return-object
                                                    outlined
                                                />
                                                <label class="label  mb-0">{{
                                                        $t("cost_of_goods_sold")
                                                    }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    :placeholder="$t('select_goods')"
                                                    v-model="mAccCostOfGoodSold"
                                                    :items="accCostOfGoodSold"
                                                    item-value="id"
                                                    :item-text="(item) => `${item.number} - ${item.name}`"
                                                    :rules="[(v) => !!v['id'] || 'Number is required']"
                                                    return-object
                                                    outlined
                                                />
                                                <label class="label">{{
                                                        $t("default_tax")
                                                    }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    tage="Default Tax"
                                                    v-model="defaultTax"
                                                    :items="vat"
                                                    item-value="id"
                                                    item-text="defaultTax"
                                                    return-object
                                                    outlined/>
                                                <label class="label">{{
                                                        $t("purchase_tax")
                                                    }}</label>
                                                <v-select
                                                    class="pt-1"
                                                    tage="Default Tax"
                                                    v-model="mPurchaseTax"
                                                    :items="purchaseTax"
                                                    item-value="id"
                                                    item-text="defaultTax"
                                                    return-object
                                                    outlined/>
                                            </v-col>
                                        </v-row>
                                    </v-col> -->
                                    <v-col sm="12" cols="12" class="pb-0">
                                        <!-- <v-row>
                                            <v-col sm="12" cols="12" class="pb-0">
                                                <label class="label">{{
                                                        $t("special_tax")
                                                    }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    tage="Special Tax"
                                                    v-model="mSpecificTax"
                                                    :items="specificTax"
                                                    item-value="id"
                                                    item-text="defaultTax"
                                                    return-object
                                                    outlined
                                                />
                                                <label class="label  mb-0">{{ $t("other_tax") }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    tage="Special Tax"
                                                    v-model="mOtherTax"
                                                    :items="otherTax"
                                                    item-value="id"
                                                    item-text="defaultTax"
                                                    return-object
                                                    outlined
                                                />
                                            </v-col>
                                        </v-row> -->
                                        <v-row>
                                            <v-col sm="12" cols="12" class="pt-0 pb-2">
                                                <v-card
                                                    outlined
                                                    dense
                                                    class="px-3 rounded-0"
                                                    height="255"
                                                >
                                                    <v-row>
                                                        <v-col sm="12" class="">
                                                            <h2 class="mb-2 font_20 width_100">
                                                                {{ $t("default_image") }}
                                                            </h2>
                                                            <v-row>
                                                                <v-col sm="5" cols="12" lass="pt-2">
                                                                    <p class="color_grey font_14">
                                                                        {{ $t("add_funct_prod_variant_desc3") }}
                                                                    </p>
                                                                </v-col>
                                                                <v-col sm="7" cols="12" class="py-0">
                                                                    <v-img
                                                                        width="100px"
                                                                        height="150px"
                                                                        :src="src"
                                                                    />
                                                                    <label>
                                                                        <input
                                                                            type="file"
                                                                            name="image"
                                                                            class="file_width"
                                                                            id="image"
                                                                            :rules="fileSizeRules"
                                                                            accept=".png, .jpg, .jpeg"
                                                                            ref="fileupload"
                                                                            @change="onFileChange"
                                                                        />
                                                                    </label>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-divider/>
                            <v-divider/>
                                <v-card outlined dense class="no_border function_footer">
                                    <v-btn @click="cancel"
                                        color="black"
                                        outlined
                                        class="text-capitalize rounded-pill black--text float-left">
                                        {{ $t("cancel") }}
                                    </v-btn>
                                    <v-btn @click="onSaveClose"
                                        color="primary"
                                        class="float-right rounded-pill white--text text-capitalize">
                                        {{ $t("save_close") }}
                                    </v-btn>

                                </v-card>
                            <!-- <v-card outlined dense class="no_border function_footer">
                                <v-btn
                                    color="black"
                                    @click="close"
                                    class="text-capitalize rounded-pill white--text float-left"
                                >{{ $t("cancel") }}
                                </v-btn>
                                <v-menu>
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" class="ml-2 rounded-pill float-right text-capitalize white--text"
                                               v-on="on">
                                            {{ $t("save_option") }}
                                            <v-icon size="" class="ma-1">expand_more</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list rounded>
                                        <v-list-item-group>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{
                                                            $t("save_new")
                                                        }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-content @click="onSaveClose">
                                                    <v-list-item-title>{{
                                                            $t("save_close")
                                                        }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </v-menu>
                                <LoadingMe
                                    :isLoading="showLoading"
                                    :fullPage="true"
                                    :myLoading="true"
                                />
                            </v-card> -->
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
            <LoadingMe :isLoading="showLoading" :fullPage="true" :myLoading="true"/>
        </v-container>
    </v-app>
</template>

<script>
import ServiceItem from "@/scripts/model/ServiceItem";
import {i18n} from '@/i18n';
let serviceItem = new ServiceItem({});
import kendo from "@progress/kendo-ui";
const accountHandler = require("@/scripts/handler/accounting/accountHandler");
const categoryHandler = require("@/scripts/categoryHandler");
const groupHandler = require("@/scripts/groupHandler");
const subGroupHandler = require("@/scripts/subGroupHandler");
const uomHandler = require("@/scripts/uomHandler");
const warehouseHandler = require("@/scripts/warehouseHandler");
const serviceItemHandler = require("@/scripts/serviceItemHandler");
const settingHandler = require("@/scripts/settingHandler");
const priceLevelHandler = require("@/scripts/priceLevelHandler")
import {dataStore} from '@/observable/store'
const loanHandler = require("@/scripts/loanHandler")
const $ = kendo.jQuery
export default {
    name: "AddServiceItem",
    props: ["id"],
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        showLoading: false,
        valid: "",
        mAccInventory: "",
        mCategory: "",
        mGroup: "",
        accRevenue: [],
        mAccCostOfGoodSold: "",
        accInventory: [],
        accCostOfGoodSold: [],
        categories: [],
        groups: [],
        group: [],
        wareHouses: [],
        mSubGroup: {},
        mIncomeAcc: {},
        mUOM: {},
        mPurchaseUOM: {},
        mWareHouse: {},
        mSpecificTax: {},
        defaultTax: {},
        purchaseTax: [],
        mPurchaseTax: {},
        subGroups: [],
        subGroup: [],
        uom: [],
        tax: [],
        specificTax: [],
        mOtherTax: {},
        otherTax: [],
        vat: [],
        service: serviceItem,
        imgFile: "",
        src: "",
        code: '',
        priceLevel: [],
        fileSizeRules: [
            (files) =>
                !files ||
                !files.some((file) => file.size > 1024 * 1024) ||
                "Image size should be less than 1 MB!",
        ],
        segments: [],
        businessCategory: []
    }),
    methods: {
        priceLevelChanged() {
            this.code = ''
            if (this.service.priceLevel) {
                if (this.service.priceLevel.hasOwnProperty('currency')) {
                    const currency = this.service.priceLevel.currency
                    if (currency.hasOwnProperty('code')) {
                        window.console.log('price level', currency.code)
                        this.code = currency.code
                    }
                }
            } else {
                this.code = ''
            }
        },
        async loadPriceLevel() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    priceLevelHandler.get().then(res => {
                        this.priceLevel = res
                        if (this.priceLevel.length > 0) {
                            this.service.priceLevel = this.priceLevel[0]
                            this.priceLevelChanged()
                        }
                    })
                }, 300)
            })
        },
        onUpdate() {
            this.$emit("onUpdate", this.service);
        },
        async onSaveClose() {
            if (!this.$refs.form.validate()) {
                this.$refs.form.validate()
                return
            }
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    let data = {
                        id: this.$route.params.id,
                        name: this.service.name,
                        sku: this.service.sku,
                        typeIs: "Service",
                        uom: this.mUOM,
                        category: this.mCategory,
                        group: this.mGroup,
                        subGroup: this.mSubGroup,
                        priceLevel: this.service.priceLevel,
                        saleDescription: this.service.saleDescription,
                        purchaseDescription: this.service.purchaseDescription,
                        warehouse: this.mWareHouse,
                        price: this.service.price,
                        incomeAcc: this.mIncomeAcc,
                      costOfGoodsSoldAcc: this.mAccCostOfGoodSold,
                        defaultTax: this.defaultTax,
                        purchaseTax: this.mPurchaseTax,
                        specificTax: this.mSpecificTax,
                        otherTax: this.mOtherTax,
                        canBeSold: this.service.canBeSold,
                        canBeSubContracted: this.service.canBeSubContracted,
                        isDelayedRevenue: this.service.isDelayedRevenue,
                        isConsignmentItem: this.service.isConsignmentItem,
                        canBeRecurringSubscribed: this.service.canBeRecurringSubscribed,
                        isMeteredService: this.service.isMeteredService,
                        isTimeBounded: this.service.isTimeBounded,
                        images: this.service.images,
                        file: this.imgFile,
                        type: this.$route.params.id ? this.$route.query.type : "new",
                    };
                    serviceItemHandler
                        .create(data)
                        .then((response) => {
                            if (response.data.statusCode === 201) {
                                // this.loadSaleUC()
                                // this.clear()
                                // this.$refs.form.reset()
                                data.id = response.data.data.id;
                                data.images = response.data.data.images;
                                // this.$emit('onUpdate', data)
                                this.$snotify.success("Success");
                                this.close(data);
                            }
                        })
                        .catch((e) => {
                            this.$snotify.error("Something went wrong");
                            this.errors.push(e);
                        });
                });
            });
        },
        onFileChange(e) {
            // const file = e.target.files[0];
            let input = e.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                if (input.files[0].size > 1024 * 1024) {
                    e.preventDefault();
                    alert("File too big (> 1MB)");
                    this.src = "";
                    this.imgFile = "";
                    this.$refs.fileupload.value = null;
                } else {
                    // create a new FileReader to read this image and convert to base64 format
                    let reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onloadend = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.imgFile = e.target.result;
                    };
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsBinaryString(input.files[0]);
                    // this.url = input.files[0]
                    this.src = URL.createObjectURL(e.target.files[0]);
                }
            }
        },
        close(data) {
            // window.history.go(-1)
            this.$router.push({
                name: "Services Projects",
                path: 'services_projects',
                params: {
                    data: data,
                },
            });
        },
        clear() {
            this.service = {};
            this.mGroup = {}
            this.mCategory = {}
            this.mUOM = {}
            this.mSubGroup = {}
            this.mSpecificTax = {}
            this.mOtherTax = {}
            this.mAccCostOfGoodSold = {}
            this.mIncomeAcc = {}
            this.mAccInventory = {}
            this.defaultTax = {}
            this.mPurchaseTax = {}
            this.mPurchaseUOM = {}
        },
        cancel() {
            this.$swal({
                title: i18n.t('msg_title_warning'),
                text: i18n.t('msg_discard'),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: i18n.t('cancel'),
                confirmButtonColor: "#4d4848",
                cancelButtonColor: "#ED1A3A",
                confirmButtonText: i18n.t('discard'),
            }).then((resultCen) => {
                if (resultCen.value) {
                    this.$router.go(-1);
                }
            });
        },
        loadCategoryAccountAndTax() {
            this.mOtherTax = this.mCategory.tax.hasOwnProperty("otherTax")
                ? this.mCategory.tax.otherTax
                : {};
            this.mSpecificTax = this.mCategory.tax.hasOwnProperty("specificTax")
                ? this.mCategory.tax.specificTax
                : {};
            this.defaultTax = this.mCategory.tax.hasOwnProperty("defaultTax")
                ? this.mCategory.tax.defaultTax
                : {};
            this.mPurchaseTax = this.mCategory.tax.hasOwnProperty("purchaseTax")
                ? this.mCategory.tax.purchaseTax
                : {};
            this.mIncomeAcc = this.mCategory.account.hasOwnProperty("incomeAcc")
                ? this.mCategory.account.incomeAcc
                : {};
            this.mAccCostOfGoodSold = this.mCategory.account.hasOwnProperty(
                "costOfGoodsSoldAcc"
            )
                ? this.mCategory.account.costOfGoodsSoldAcc
                : {};
        },
        async onCategoryChanged() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    // window.console.log(this.mCategory)
                    this.mGroup = "";
                    this.mSubGroup = "";
                    // this.loadCategoryAccountAndTax()
                    this.group = this.groups.filter(
                        (m) => m.category.id === this.mCategory.id
                    );
                    if (this.group.length > 0) {
                        this.mGroup = this.group[0];
                        this.subGroup = this.subGroups.filter(
                            (m) => m.group.id === this.group[0].id
                        );
                        if (this.subGroup.length > 0) {
                            this.mSubGroup = this.subGroup[0];
                        }
                    }
                    this.loadCategoryAccountAndTax()
                }, 300);
            });
        },
        async loadAccount() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    accountHandler.getAll().then((res) => {
                        this.showLoading = false;
                        this.accRevenue = res.data
                            .filter((m) => m.account_type.name === "Revenues")
                            .map((item) => {
                                return {
                                    id: item.uuid,
                                    uuid: item.uuid,
                                    name: item.name,
                                    local_name: item.local_name,
                                    number: item.number,
                                    is_taxable: item.is_taxable,
                                    banhjiAccCode: item.banhjiAccCode,
                                    group_code: item.group_code,
                                    parent_account: item.parent_account,
                                    type_code: item.type_code,
                                    account_type: item.account_type
                                }
                            });
                        if (this.accRevenue.length > 0) {
                            this.mIncomeAcc = this.accRevenue[0];
                        }
                        this.accInventory = res.data
                            .filter((m) => m.account_type.name === "Inventory")
                            .map((item) => {
                                return {
                                    id: item.uuid,
                                    uuid: item.uuid,
                                    name: item.name,
                                    local_name: item.local_name,
                                    number: item.number,
                                    is_taxable: item.is_taxable,
                                    banhjiAccCode: item.banhjiAccCode,
                                    group_code: item.group_code,
                                    parent_account: item.parent_account,
                                    type_code: item.type_code,
                                    account_type: item.account_type
                                }
                            });
                        if (this.accInventory.length > 0) {
                            this.mAccInventory = this.accInventory[0];
                        }
                        this.accCostOfGoodSold = res.data
                            .filter((m) => m.account_type.name === "Cost of Sales")
                            .map((item) => {
                                return {
                                    id: item.uuid,
                                    uuid: item.uuid,
                                    name: item.name,
                                    local_name: item.local_name,
                                    number: item.number,
                                    is_taxable: item.is_taxable,
                                    banhjiAccCode: item.banhjiAccCode,
                                    group_code: item.group_code,
                                    parent_account: item.parent_account,
                                    type_code: item.type_code,
                                    account_type: item.account_type
                                }
                            });
                        if (this.accCostOfGoodSold.length > 0) {
                            this.mAccCostOfGoodSold = this.accCostOfGoodSold[0];
                        }
                    });
                }, 300);
            });
        },
        async loadCategory() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    categoryHandler.get().then((res) => {
                        this.showLoading = false;
                        // this.categories = res;
                        // window.console.log(res)
                        let self = this
                        // this.categories = this.categories.filter(i => i.hasOwnProperty('type') && i.type.name === 'Service')
                        $.each(res, function (i,v){
                            if($.inArray(v.id, self.businessCategory) != -1) {
                                self.categories.push(v)
                            }
                        })
                        window.console.log(res, this.categoties, this.businessCategory, 'category')
                        if (this.categories.length > 0) {
                            this.mCategory = this.categories[0];
                            this.onCategoryChanged();
                        }
                    });
                }, 300);
            });
        },
        async loadGroup() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    groupHandler.get().then((res) => {
                        this.showLoading = false;
                        this.groups = res.filter(m => m.category.hasOwnProperty('type') && m.category.type.name === 'Service');
                        // window.console.log(res, 'group')
                        // this.loadSubGroup(this.mGroup);
                    });
                }, 300);
            });
        },
        async loadSubGroup(group) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    subGroupHandler.get().then((res) => {
                        this.showLoading = false;
                        if (group) {
                            if (group.hasOwnProperty('id')) {
                                this.subGroups = res.filter(m => m.group.id === group.id)
                            }
                        }
                    });
                }, 300);
            });
        },
        async skuGenerator() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    // window.console.log(this.mCategory.abbr);
                    this.service.sku =
                        this.mCategory.abbr +
                        "/" +
                        this.mGroup.abbr +
                        "/" +
                        this.mSubGroup.abbr +
                        "-" +
                        this.service.name.toString().substring(0, 3);
                }, 300);
            });
        },
        async loadUOM() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    uomHandler.get().then((res) => {
                        this.showLoading = false;
                        this.uom = res;
                        if (this.uom.length > 0) {
                            this.mUOM = this.uom[0];
                            // this.mPurchaseUOM = this.uom[0];
                        }
                    });
                }, 300);
            });
        },
        async loadWareHouses() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    warehouseHandler.getWarehouseSettingAll().then((res) => {
                        this.showLoading = false;
                        this.wareHouses = res;
                        if (this.wareHouses.length > 0) {
                            this.mWareHouse = this.wareHouses[0];
                        }
                    });
                }, 300);
            });
        },
        async loadTax() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    settingHandler.get().then((res) => {
                        this.showLoading = false;
                        this.tax = res
                        let st = this.tax.filter(m => m.taxType.typeId === 8 && m.transactionType === 'Sale') //specific tax
                        this.specificTax = st // special tax

                        let vAT = this.tax.filter(m => m.taxType.typeId === 1 && m.transactionType === 'Sale') // valuable tax
                        this.vat = vAT // valuable tax

                        let otTax = this.tax.filter(m => m.taxType.typeId === 7 && m.transactionType === 'Sale') // Other tax
                        this.otherTax = otTax // valuable tax

                        this.purchaseTax = this.tax.filter(m => m.taxType.typeId === 1 && m.transactionType === 'Purchase') // valuable tax
                        // this.mPurchaseTax = purchaseTax // valuable tax

                        if (this.specificTax.length > 0) {
                            this.mSpecificTax = this.specificTax[0]
                        }
                        if (this.vat.length > 0) {
                            this.defaultTax = this.vat[0]
                        }
                        if (this.otherTax.length > 0) {
                            this.mOtherTax = this.otherTax[0]
                        }
                        if (this.purchaseTax.length > 0) {
                            this.mPurchaseTax = this.purchaseTax[0]
                        }
                    });
                }, 300);
            });
        },
        async loadSingleService() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.showLoading = true;
                    serviceItemHandler.getOne(this.$route.params.id).then(async (res) => {
                        this.showLoading = false;
                        this.service = res;
                        if (this.service.id !== undefined) {
                            this.mCategory = this.service.category;
                            await this.loadGroup()
                            this.mGroup = this.service.group;
                            await this.loadSubGroup(this.mGroup)
                            this.mSubGroup = this.service.subGroup;
                            this.mUOM = this.service.uom;
                            // this.mPurchaseUOM = this.service.purchaseUOM;
                            this.mAccCostOfGoodSold = this.service.costOfGoodsSoldAcc;
                            // this.mAccInventory = this.service.inventoryAccount;
                            this.mIncomeAcc = this.service.incomeAcc;
                            this.mSpecificTax = this.service.specificTax;
                            this.mOtherTax = this.service.otherTax;
                            this.defaultTax = this.service.defaultTax;
                            this.mPurchaseTax = this.service.purchaseTax;
                            this.mWareHouse = this.service.warehouse;
                            this.src = "";
                            if (this.service.hasOwnProperty("images")) {
                                let imgUrl = "";
                                if (this.service.images.hasOwnProperty("default")) {
                                    imgUrl = this.service.images.default.thumb;
                                    this.src =
                                        "https://s3-ap-southeast-1.amazonaws.com/images.banhji/" +
                                        imgUrl;
                                }
                            }

                            if (this.$route.query.type === "new") {
                                this.src = "";
                            }
                        }
                    });
                }, 300);
            });
        },
        async initData() {
            if (this.$route.params.id !== undefined) {
                await this.loadSingleService();
            }
        },
        async loadSegment() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.segment = {}
                    loanHandler.businessSettingGet().then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            let s = res.data.data.filter((obj) => {
                                return obj.type == dataStore.businessType
                            })
                            window.console.log(s, 'segment')
                            if (s.length > 0) {
                                // this.segments.push(s[0].segment)
                                // this.purchase.segment = s[0].segment
                                this.businessCategory = []
                                // if (s[0].productCategories.length > 0) {
                                //     let self = this
                                //     $.each(s[0].productCategories, function (i, v) {
                                //         self.businessCategory.push(v.category.id)
                                //     })
                                // }
                                if (s[0].serviceCategories.length > 0) {
                                    let self = this
                                    $.each(s[0].serviceCategories, function (i, v) {
                                        self.businessCategory.push(v.category.id)
                                    })
                                }
                                // this.loadItem()
                                this.loadCategory()
                            } else {
                                this.$snotify.error('Please select segment on setting page')
                                this.cancel()
                            }
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
    },
    mounted: async function () {
        await this.loadUOM();
        await this.loadWareHouses();
        await this.loadTax();
        await this.initData();
        // await this.loadCategory();
        await this.loadGroup();

        await this.loadPriceLevel();
    },
    computed: {},
    created: async function () {
        await this.loadAccount();
        await this.loadSegment();
    },
    watch: {
        id() {
            // window.console.log(this.id, "watch");
            if (this.id !== undefined) {
                this.loadSingleService();
            }
        },
    },
};
</script>

<style scoped>
.function_content {
    padding: 0 25px 25px;
    border-bottom: 0;
    background-color: #fff !important;
}

@media (min-width: 1264px) {
    .container {
        /* max-width: 1185px; */
        max-width: 1080px !important;
    }
}

.grayBg {
    background-color: #F8F8F9;
}

@media (max-width: 576px) {
    .mb-6 {
        margin-bottom: 0 !important;
    }
}

.section2 {
    border: 1px solid #d6d7d8;
}

.border_grey {
    border: 1px solid #d6d7d8;
}

.attachment_table {
    width: 100%;
}

.my_checkbox input[type="checkbox"] + label {
    display: grid;
    grid-template-columns: 20% 80%;
    margin: 0.2em 0px;
    cursor: pointer;
    line-height: 16px;
    padding: 0.2em;
}
</style>
