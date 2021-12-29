<template>
    <v-row>
        <v-col sm="12" clos="12" class="pt-0">
            <h2 class=" font_18">{{$t('weight_average_cost')}}</h2>
            <v-simple-table class="attachment_table">
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th>{{$t('wac')}}</th>
                        <th>{{$t('last_update')}}</th>
                        <th>{{$t('no_of_update')}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>01</td>
                        <td>JB00009</td>
                        <td>15/July/2020</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        data: () => ({
            dialogm2: false
        })
    }
</script>