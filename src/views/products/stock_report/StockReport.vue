<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-2">
            <div style="background-color: #fff; padding: 0 0 5px;">
                <v-tabs class="tabs_2">
                    <!-- <v-tab>
                        <span class=" text-capitalize text-left">
                            {{ $t('balance') }}
                        </span>
                    </v-tab> -->
                    <v-tab>
                
                        <span class=" text-capitalize">
                            {{ $t('detail') }}
                        </span>
                    </v-tab>
                    <!-- <v-tab>
                        <span class=" text-capitalize">
                            {{ $t('reorder') }}
                        </span>
                    </v-tab> -->
                    <!-- <v-tab-item>
                        <v-row>
                            <v-col style="background: #fff" sm="12" cols="12" class="pt-0">
                               <Balance/>
                            </v-col>
                        </v-row>
                    </v-tab-item> -->
                    <v-tab-item>
                        <v-row>
                            <v-col style="background: #fff" sm="12" cols="12" class="pt-0">
                               <Detail/>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- <v-tab-item>
                        <v-row>
                            <v-col style="background: #fff" sm="12" cols="12" class="pt-0">
                               <Reorder/>
                            </v-col>
                        </v-row>
                    </v-tab-item> -->
                </v-tabs>
            </div>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Sales',
        data: () => ({
            isHide: false
        }),
        props: {},
        methods: {
            hideTabs(){
				this.isHide = !this.isHide;
			},
        },
        components: {
            // Balance: () => import('./Balance'),
            Detail: () => import('./Detail'),
            // Reorder: () => import('./Reorder')
        },
    };
</script>
<style scoped>
    .arr_icon {
        color: #2CA01C;
    }
    .arr_icon1 {
        color: #4c9aff;
        color: #2CA01C;
    }
    .v-tab {
        min-width: 30px;
        font-size: 16px;
        text-transform: capitalize;
    }

    .v-tab--active {
        background-color: rgb(255, 255, 255);
    }

    .tab_setting .v-tab--active {
        font-weight: 700;
        color: #000;
        background-color: #ffffff !important;
        border-bottom: 4px solid #92d050;
        border-left: none;

    }
    .tabs_2 .v-tab--active{
        background-color: #F8F8F9 !important;
        border-bottom: 4px solid #92d050;
        border-left: none;

    }
    .theme--light.v-card > .v-card__text, .theme--light.v-card .v-card__subtitle {
        color: rgba(0, 0, 0, 1)  !important;
    }

    /* .v-tab--active {
    } */

    p {
        color: rgba(0, 0, 0, 0.87);
    }

</style>