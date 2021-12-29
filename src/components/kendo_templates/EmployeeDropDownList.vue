<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Employee"
        v-model="employee"
        :items="employees"
        item-text="firstName"
        item-value="id"
        @change="emitEmployee(), onChanged()"
        return-object
        outlined>
        <template slot="selection" slot-scope="{ item }">
            {{ item.firstName }} {{ item.lastName }}
        </template>
        <template slot="item" slot-scope="{ item }">
            {{ item.firstName }} {{ item.lastName }}
        </template>
    </v-select>
</template>

<script>
import {EmployeeModel} from "@/scripts/model/AppModels";

const {employeeHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'EmployeeDropDownList',
    props: {
        initEmployee: {
            type: EmployeeModel,
        },
    },
    data() {
        return {
            employee: new EmployeeModel(),
            employees: [],
            loading: false
        }
    },
    methods: {
        emitEmployee() {
            this.$emit('emitEmployee', new EmployeeModel(this.employee));
        },
        onChanged() {
            this.$emit('onChanged')
        },
    },
    watch: {
        initEmployee() {
            this.employee = this.initEmployee;
        }
    },
    created() {
        this.loading = true
        // Call Obj List
        employeeHandler.getAll()
            .then(res => {
                if (res) {
                    let employeeList = [];
                    res.forEach(value => {
                        let emp = new EmployeeModel(value);
                        employeeList.push(emp);
                    });
                    this.employees = employeeList;
                }
                this.loading = false
            })
    },
    mounted() {
        /* Initial Employee */
        this.employee = this.initEmployee;
    }
}
</script>