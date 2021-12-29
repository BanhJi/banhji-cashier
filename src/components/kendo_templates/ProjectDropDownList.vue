<template>
  <v-select
      :loading="loading"
      class="mt-1"
      placeholder="Select Project"
      v-model="project"
      :items="projects"
      item-text="name"
      item-value="id"
      @change="emitProject"
      return-object
      clearable
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
import {ProjectModel} from "@/scripts/model/AppModels";

const {projectHandler} = require("@/scripts/AppHandlers");

export default {
  name: 'ProjectDropDownList',
  props: {
    initProject: {
      type: ProjectModel,
    },
  },
  data() {
    return {
      project: new ProjectModel(),
      projects: [],
      loading: false
    }
  },
  methods: {
    emitProject() {
      this.$emit('emitProject', new ProjectModel(this.project));
    },
  },
  watch: {
    initProject() {
      this.project = this.initProject;
    }
  },
  created() {
    this.loading = true
    // Call Project List
    projectHandler.getAll()
        .then(res => {
          if (res) {
            let projectList = [];
            res.forEach(value => {
              let pro = new ProjectModel(value);
              projectList.push(pro);
            });
            this.projects = projectList;
          }
          this.loading = false
        })
  },
  mounted() {
    /* Initial Project */
    this.project = this.initProject;
  }
}
</script>