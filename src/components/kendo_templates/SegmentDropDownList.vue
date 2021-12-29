<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Segment"
        v-model="segment"
        :items="segments"
        item-text="name"
        item-value="id"
        @change="emitSegment"
        return-object
        outlined>
        <template slot="selection" slot-scope="{ item }">
            {{ item.code }} - {{ item.name }}
        </template>
        <template slot="item" slot-scope="{ item }">
            {{ item.code }} - {{ item.name }}
        </template>
    </v-select>
</template>

<script>
import {SegmentModel} from "@/scripts/model/AppModels";

const {segmentHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'SegmentDropDownList',
    props: {
        initSegment: {
            type: SegmentModel,
        },
    },
    data() {
        return {
            segment: null,
            segments: [],
            loading: false
        }
    },
    methods: {
        emitSegment() {
            this.$emit('emitSegment', this.segment);
        },
    },
    watch: {
        initSegment() {
            this.segment = this.initSegment;
        }
    },
    mounted() {
        /* Initial Segment */
        this.segment = this.initSegment;
        this.loading = true
        // Call Segment List
        segmentHandler.getAll()
            .then(res => {
                if (res) {
                    let segmentList = [];
                    res.forEach(value => {
                        let seg = new SegmentModel(value);
                        segmentList.push(seg);
                    });
                    this.segments = segmentList;
                }
                this.loading = false
            })
    }
}
</script>