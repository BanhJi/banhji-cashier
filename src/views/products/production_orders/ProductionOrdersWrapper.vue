<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-0">
            <v-tabs>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-capitalize">
                        {{$t('production_order')}}
                    </span>
                </v-tab>
                <v-tab>
                    <span class="hidden-sm-and-up">
                        <v-icon left>mdi-pen</v-icon>
                    </span>
                    <span class="hidden-sm-and-down text-capitalize">
                        {{$t('production')}}
                    </span>
                </v-tab>
                <v-tab-item>
                        <v-row>
                            <v-col style="background: #fff" sm="12" cols="12" class="pt-0">
                                <ProductionOrders/>
                            </v-col>
                        </v-row>
                </v-tab-item>
                <v-tab-item>
                        <v-row>
                            <v-col style="background: #fff" sm="12" cols="12" class="pt-0">
                                <Productions/>
                            </v-col>
                        </v-row>
                </v-tab-item>
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script>
    import ProductionOrders from "./ProductionOrders";
    import Productions from "./Productions";

    export default {
        data: () => ({}),
        props: {},
        methods: {},
        mounted() {
        },
        computed: {},
        components: {
            Productions,
            ProductionOrders,
        },
    };
</script>

<style scoped>
    .v-tab--active {
        background-color: #E5EFFA;
        color: #000;
    }
    .v-tab {
        min-width: 30px;
        font-size: 17px;
        text-transform: capitalize;
    }
</style>
