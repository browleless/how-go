<template>
    <v-card class="list">
        <v-list>
            <template v-for="(item, index) in items">
                <v-list-tile avatar ripple :key="item.id" @click="onClick(index)">
                    <v-list-tile-action>
                        <v-icon>places</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.structured_formatting.main_text }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                            {{ item[display] }}
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
            </template>
        </v-list>
    </v-card>
</template>

<script>
export default {

    name: 'place-autocomplete-list',

    props: {

        'items': {
            type: Array,
            default: () => {
                return [];
            }
        },

        'display': {
            type: String,
            default: 'description'
        }

    },

    methods: {

        onClick(index, item) {
            this.$emit('item:click', index, this);
        }

    }

};
</script>

<style scoped>
.list {
    position: absolute;
    z-index: 999;
}
</style>
