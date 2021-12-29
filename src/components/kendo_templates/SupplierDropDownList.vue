<template>
  <v-select class="mt-1"
            :loading="loading"
            placeholder="Select Supplier"
            v-model="supplier"
            :items="suppliers"
            item-text="name"
            item-value="id"
            @change="emitSupplier(),onChanged()"
            return-object
            outlined>
    <template slot="selection" slot-scope="{ item }">
      {{ item.name }}
    </template>
    <template slot="item" slot-scope="{ item }">
      {{ item.number }} - {{ item.name }}
    </template>
  </v-select>
</template>

<script>
import {SupplierModel} from "@/scripts/model/AppModels";

const {supplierHandler} = require("@/scripts/AppHandlers");

export default {
  name: 'SupplierDropDownList',
  props: {
    initSupplier: {
      type: SupplierModel,
    },
  },
  data() {
    return {
      supplier: new SupplierModel(),
      suppliers: [],
      loading: false
    }
  },
  methods: {
    emitSupplier() {
      this.$emit('emitSupplier', new SupplierModel(this.supplier));
    },
    onChanged() {
      this.$emit('onChanged')
    },
  },
  watch: {
    initSupplier() {
      this.supplier = this.initSupplier;
    }
  },
  created() {
    this.loading = true
    // Call Supplier List
    supplierHandler.getAll()
        .then(res => {
          if (res) {
            let supplierList = [];
            res.forEach(value => {
              let sup = new SupplierModel(value);
              supplierList.push(sup);
            });
            this.suppliers = supplierList;
          }
          this.loading = false
        })
  },
  mounted() {
    /* Initial Supplier Id */
    this.supplier = this.initSupplier;
  }
}
</script>