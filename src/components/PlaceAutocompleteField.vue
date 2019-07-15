<template>
    <div @keyup="onKeyup">
        <v-text-field
            hide-details
            :prepend-inner-icon="icon"
            v-model="query"
            v-bind-events
            v-bind="$attrs"
            :label="label"
            :errors="errors"
            :value="value"
            @input="$emit('input', query)">
        </v-text-field>
        <place-autocomplete-list v-if="predictions && showPredictions" :items="predictions" @item:click="onItemClick"/>
    </div>
</template>

<script>
import script from 'vue-interface/src/Helpers/Script';
import PlaceAutocompleteList from './PlaceAutocompleteList';
import FormControl from 'vue-interface/src/Mixins/FormControl';
import FormGroup from 'vue-interface/src/Components/FormGroup';
import InputField from 'vue-interface/src/Components/InputField';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

function geocode(options) {
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        if (!options.geometry) {
            geocoder.geocode(options, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(results);
                }
                else {
                    reject(status);
                }
            });
        }
        else {
            resolve([options]);
        }
    });
}

export default {

    name: 'place-autocomplete-field',

    mixins: [
        FormControl
    ],

    components: {
        FormGroup,
        InputField,
        ActivityIndicator,
        PlaceAutocompleteList
    },

    watch: {
        value(value) {
            this.query = value;
        }
    },

    props: {

        icon: {
            type: String,
            default: ''
        },

        apiKey: {
            type: String,
            required: true
        },

        baseUri: {
            type: String,
            default: 'https://maps.googleapis.com/maps/api/js'
        },

        componentRestrictions: {
            type: [Boolean, Object, String],
            default: false
        },

        custom: Boolean,

        libraries: {
            type: Array,
            default() {
                return ['geometry', 'places'];
            }
        },

        bounds: {
            type: [Boolean, Object, String],
            default: false
        },

        location: {
            type: [Boolean, Object, String],
            default: false
        },

        offset: {
            type: Boolean,
            default: false
        },

        radius: {
            type: Boolean,
            default: false
        },

        types: {
            type: [Boolean, Array],
            default: false
        }

    },

    methods: {

        getInputElement() {
            return this.$el.querySelector('input');
        },

        getRequestOptions() {
            const options = {
                input: this.getInputElement().value,
                componentRestrictions: { country: 'sg' }
            };

            return options;
        },

        select(place) {
            geocode({ placeId: place.place_id }).then(response => {
                //this.hide();
                if (response[0].formatted_address.slice(0, response[0].formatted_address.indexOf(',')) === place.structured_formatting.main_text) {
                    this.query = response[0].formatted_address
                } else {
                    this.query = place.structured_formatting.main_text + ', ' + response[0].formatted_address
                }
                this.$emit('input', this.query);
                this.$emit('autocomplete-select', place, response[0]);
            });
        },

        search() {
            return new Promise((resolve, reject) => {
                if (!this.getInputElement().value) {
                    this.predictions = false;
                    this.showPredictions = false;
                    // reject(new Error('Input empty'));
                }
                else {
                    this.showActivityIndicator = true;

                    this.$service.getPlacePredictions(this.getRequestOptions(), (response, status) => {
                        this.showActivityIndicator = false;

                        switch (status) {
                        case window.google.maps.places.PlacesServiceStatus.OK:
                            resolve(response);
                            break;
                        default:
                            reject(new Error(`Error with status: ${status}`));
                        }
                    });
                }
            });
        },

        hide() {
            this.showPredictions = false;
        },

        show() {
            this.showPredictions = true;
        },

        onKeyup(event) {

            if (event.keyCode === 27) {
                this.hide()
                return
            }

            this.search().then(response => {
                this.predictions = response;
                this.showPredictions = true;
            }, error => {
                if (error) {
                    this.predictions = false;
                }
            });
        },

        onItemClick(event, child) {
            this.select(child.items[event]);
            this.predictions = false;
        }

    },

    mounted() {
        script(`${this.baseUri}?key=${this.apiKey}&libraries=${this.libraries.join(',')}`).then(() => {
            this.$geocoder = new window.google.maps.Geocoder();
            this.$service = new window.google.maps.places.AutocompleteService();
            this.loaded = true;
            this.$emit('loaded');
        });
    },

    data() {
        return {
            loaded: false,
            predictions: false,
            query: this.value,
            showPredictions: false,
        };
    }

};
</script>
