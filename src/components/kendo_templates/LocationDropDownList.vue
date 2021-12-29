<template>
  <v-select
      :loading="loading"
      class="mt-1"
      placeholder="Select Location"
      v-model="location"
      :items="locations"
      item-text="name"
      item-value="id"
      @change="emitLocation();onChanged()"
      return-object
      outlined>
    <template slot="selection" slot-scope="{ item }">
      {{ item.name }}
    </template>
    <template slot="item" slot-scope="{ item }">
      {{ item.code }} - {{ item.name }}
    </template>
  </v-select>
</template>

<script>
import {LocationModel} from "@/scripts/model/AppModels";

const {locationHandler} = require("@/scripts/AppHandlers");

export default {
  name: 'LocationDropDownList',
  props: {
    initLocation: {
      type: LocationModel,
    },
  },
  data() {
    return {
      location: '',
      locations: [],
      loading: false
    }
  },
  methods: {
    emitLocation() {
      this.$emit('emitLocation', new LocationModel(this.location));
    },
    onChanged() {
      this.$emit('onChanged')
    },
  },
  watch: {
    initLocation() {
      this.location = this.initLocation;
    }
  },
  mounted() {
    this.loading = true
    /* Initial Location */
    this.location = this.initLocation;

    // Call Location List
    locationHandler.getAll()
        .then(res => {
          let locationList = [];
          res.forEach(value => {
            let loc = new LocationModel(value);
            locationList.push(loc);
          });
          this.locations = locationList;
          this.loading = false
        })
  }
}
</script>