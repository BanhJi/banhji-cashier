<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <v-tabs>
                <v-tab>
                    <span class="hidden-sm-and-up"><v-icon left>mdi-pen</v-icon></span>
                    <span class="hidden-sm-and-down">{{ $t('variants') }} </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up"><v-icon left>mdi-pen</v-icon></span>
                    <span class="hidden-sm-and-down">{{ $t('catalog') }}</span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up"><v-icon left>mdi-pen</v-icon></span>
                    <span class="hidden-sm-and-down">{{ $t('products') }}</span>
                </v-tab>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0">
                            <Variants :productId="productId"/>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0">
                            <Catalog/>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0">
                            <Products :productId="productId"/>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script>

export default {
    name: "",
    components: {
        Catalog: () => import(`./Catalog`),
        Products: () => import(`./products/Products`),
        Variants: () => import(`./variants/Variants`)
    },
    data: () => ({
        productId: 'helloooo'

    }),
    watch: {
        // productId(){
        //     window.console.log('from Product', this.productId)
        // }
    },
    methods: {
        onProductSelected(id) {
            this.productId = id
            window.console.log('from product', id)
        }
    }
};
</script>
<style scoped>
.v-tab {
    min-width: 30px;
    font-size: 17px;
    text-transform: capitalize;
}

.v-tab--active {
    background-color: rgb(255, 255, 255);
}

.v-menu__content {
    top: 141px !important;
    left: 1098px !important;
}

.v-menu__content .v-list .v-list-item {
    min-height: 35px !important;
}

.tab_wrapper {
    position: relative;
    display: inherit;
}
.v-icon--left {
    margin-right: 0px;
}

.Light_grey {
    background-color: #F8F8F9 !important;
}

.theme--light.v-tabs >>> .v-tabs-bar {
    border-bottom: none !important;
}


.v-tabs-bar {
    border-bottom: none !important;
}

.v-card__text {
    padding: 0 !important;
}

.v-window-item--active {
    padding-left: 12px !important;
    padding-right: 12px !important;
}

.grayBg {
    background-color: #F8F8F9;
}

.v-tab--active {
    background-color: #E5EFFA;
    color: #000;
}

</style>
	