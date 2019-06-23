<template>
    <v-app id="sandbox" :dark="dark">
        <v-navigation-drawer class="header"
                             v-model="primaryDrawer.model"
                             :permanent="primaryDrawer.type === 'permanent'"
                             :temporary="primaryDrawer.type === 'temporary'"
                             :clipped="primaryDrawer.clipped"
                             :floating="primaryDrawer.floating"
                             :mini-variant="primaryDrawer.mini"
                             absolute
                             overflow
                             app>
            <v-toolbar flat>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title class="title">
                            Amazon Hot Searches
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-container>
                <h2>Scheme</h2>
                <v-switch v-model="dark" primary label="Dark"></v-switch>
                <v-divider style="margin: 20px;"></v-divider>
                <h2>Categories</h2>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-checkbox v-for="(category) in categories" v-bind:key="category.name"
                                    v-model="selectedCategories"
                                    :label="category.name"
                                    color="orange"
                                    hide-details
                                    :value="category.alias"
                        >
                        </v-checkbox>
                        {{ selectedCategories.length }}
                        {{ selectedCategories }}

                    </v-flex>
                </v-layout>
            </v-container>
        </v-navigation-drawer>
        <v-toolbar class="header" :clipped-left="primaryDrawer.clipped" app absolute>
            <v-toolbar-side-icon
                    v-if="primaryDrawer.type !== 'permanent'"
                    @click.stop="primaryDrawer.model = !primaryDrawer.model"
            ></v-toolbar-side-icon>
            <v-toolbar-title>Vuetify</v-toolbar-title>
        </v-toolbar>
        <v-content class="main">
            <v-container fluid>

                <v-layout row wrap v-if="this.results.length > 8">
                    <v-flex v-for="res in results.slice(0, 8)" v-bind:key="res.text" xs3>
                        <keyword-panel v-bind:keywords="results"></keyword-panel>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer :inset="footer.inset" app>
            <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
    import KeywordPanel from './components/KeywordPanel'
    import Vue from 'vue'
    import Vuetify from 'vuetify'
    import axios from "axios";

    Vue.use(Vuetify)
    export default {
        name: 'App',
        components: {
            KeywordPanel: KeywordPanel
        },
        data: () => ({
            results: [],
            queries: ['a'],
            selectedCategories: ['digital-text'],
            categories: [
                {
                    name: 'Books',
                    alias: 'digital-text',
                    value: true
                },
                {
                    name: 'Electronics',
                    alias: 'electronics-intl-ship',
                    value: false
                }
            ],
            dark: true,
            drawers:
                ['Default (no property)', 'Permanent', 'Temporary'],
            primaryDrawer: {
                model: null,
                type: 'temporary',
                clipped: false,
                floating: false,
                mini: false
            },
            footer: {
                inset: false
            }
        }),
        mounted() {
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/http://completion.amazon.com/search';

            this.getHotSearches();
        },

        methods: {
            getHotSearches() {
                const urlBase = 'complete?client=amazon-search-ui&mkt=1';
                this.selectedCategories.forEach(alias => {
                    this.queries.forEach(query => {
                        const url = urlBase + '&search-alias=' + alias + '&q=' + query;
                        axios.get(url).then(response => {
                            const data = response.data;
                            if (data[0] === query && data.length > 1) {
                                data[1].forEach(res => {
                                    if (!this.results.includes(res)) {
                                        this.results.push({
                                            text: res,
                                            category: alias,
                                            color: Math.floor(Math.random() * 10)
                                        })
                                    }
                                });
                            }
                        })
                    });
                });
            }
        }
    }
</script>

<style>
    .main {
        background-color: #EAEDED;
    }

    .header {
        background-color: #232F3F;
    }
</style>
