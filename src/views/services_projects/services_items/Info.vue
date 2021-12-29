<template>
    <v-row class="px-1">
        <v-col sm="12" cols="12">
            <v-row>
                <v-col sm="12" cols="12" class="py-0">
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                            <tr>
                                <td class="text-uppercase">{{ $t('name') }}</td>
                                <td class="text-left text-bold">{{ service.name }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('categories') }}</td>
                                <td class="text-left text-bold">{{ category }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('group') }}</td>
                                <td class="text-left text-bold">{{ group }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('sub_group') }}</td>
                                <td class="text-left text-bold">{{ subGroup }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('uom') }}</td>
                                <td class="text-left text-bold">{{ uom }}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-col>
        <v-col sm="12" cols="12" class="pb-0">
            <v-simple-table>
                <template v-slot:default>
                    <tbody>
                    <tr>
                        <td class="text-uppercase third white--text ">{{ $t('revenue') }}</td>
                        <td class="text-bold third white--text text-right">$10,000</td>
                    </tr>
                    <tr>
                        <td class="text-uppercase third white--text">{{ $t('monthly_revenue') }}</td>
                        <td class="text-bold third white--text text-right"/>
                    </tr>
                    <tr>
                        <td class="secondary white--text text-uppercase">{{ $t('cost') }}</td>
                        <td class="secondary white--text text-right text-bold">$10,000</td>
                    </tr>
                    <tr>
                        <td  class="secondary white--text text-uppercase">{{ $t('last_used') }}</td>
                        <td  class="secondary white--text text-right text-bold">7/10/2020</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <!-- <v-col sm="12" cols="12">
            <v-row>
                <v-col sm="12" cols="12" class="py-0">
                    <router-link
                        :to="{path: 'service'+`/${this.service?this.service.id:''}`, query: { type: 'edit'} }">
                        <v-btn width="120" color="primary" :disabled="btnEnabled"
                               class="rounded-pill white--text float-right text-capitalize ml-5">
                            {{ $t('edit_service') }}
                        </v-btn>
                    </router-link>
                </v-col>
            </v-row>
        </v-col> -->
    </v-row>
</template>
<script>
export default {
    name: "ServiceInfo",
    props: {
        service: {}
    },
    data() {
        return {
            pic: "amret.png",
            url: 'https://s3-ap-southeast-1.amazonaws.com/images.banhji/'
        }
    },
    methods: {
        onUpdate() {
            this.$emit('onUpdate', this.service ? this.service : {})
        },
        callback() {
            if (this.$route.params !== null && this.$route.params.hasOwnProperty('data')) {
                // this.service = this.$route.params.data
                this.$emit('onUpdate', this.$route.params.data)
            }
            // window.console.log('im changed', this.service)
        }
    },
    computed: {
        subGroup() {
            if (this.service) {
                if (this.service.subGroup) {
                    return this.service.subGroup.name
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        uom() {
            if (this.service) {
                if (this.service.uom) {
                    return this.service.uom.name
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        group() {
            if (this.service) {
                if (this.service.group) {
                    return this.service.group.name
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        category() {
            if (this.service) {
                if (this.service.category) {
                    return this.service.category.name
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        imgURL() {
            if (this.service) {
                if (this.service.images) {
                    let img = this.service.images
                    let imgDefault = img.default
                    if (imgDefault) {
                        return this.url + imgDefault.thumb
                    } else {
                        return ''
                    }
                } else {
                    return ''
                }
            } else {
                return ''
            }

        },
        btnEnabled() {
            if (this.service) {
                return !this.service;
            } else {
                return false
            }
        }
    },
    watch: {
        '$route': 'callback'
    }
}
</script>
<style scoped>
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.v-application .secondary,
.v-application .third {
    border-color: #fff !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr.secondary:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: #4d4848 !important;
}

.theme--light.v-data-table {
    background-color: transparent !important;
    border-top: thin solid #ddd;
    border-bottom: thin solid #ddd;
    border-radius: 0 !important;
}

/* .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row),
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
    border-bottom: thin solid #ddd;
} */

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 32px !important;
}

</style>
