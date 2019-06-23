<template>
    <v-app :dark="dark">
        <v-navigation-drawer :class="dark ? 'drawer-dark' : 'drawer-light'" v-model="primaryDrawer.model"
                             absolute overflow app temporary>
            <v-container>
                <h2>Theme</h2>
                <v-switch v-model="dark" primary label="Dark"></v-switch>
                <v-divider style="margin: 20px"></v-divider>
                <h2>Categories</h2>
                <v-layout row wrap>
                    <v-flex xs12>
                        <div v-for="category in categories" v-bind:key="category.name">
                            <div v-if="category.divider">
                                <br>
                                <h3>{{category.title}}</h3>
                            </div>
                            <v-checkbox v-else :disabled="(!category.exclusive && disableRegularCategories)"
                                        v-model="selectedCategories" :label="category.name" color="orange"
                                        hide-details :value="category.alias" @change="getHotSearches(category)">
                            </v-checkbox>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-navigation-drawer>

        <v-content :class="dark ? 'main-dark' : 'main-light'">
            <v-container fluid>
                <v-btn style="z-index: 2" fab light small color="white" @click.stop="primaryDrawer.model = !primaryDrawer.model">
                    <v-icon dark>{{ primaryDrawer.model ? 'arrow_back' : 'arrow_forward' }}</v-icon>
                </v-btn>

                <v-container style="margin-top: -50px;"
                             v-if="this.results.length > 8 && this.resultsReady && !this.scheduleRefresh" bg fill-height
                             grid-list-md>
                    <v-layout row wrap align-center>
                        <v-flex v-for="res in results.slice(0, 8)" v-bind:key="res.text" xs6 md3>
                            <keyword-panel v-bind:keywords="results"></keyword-panel>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-layout v-else-if="this.selectedCategories.length === 0" column wrap align-center justify-center
                          class="text-xs-center" style="margin-top: 200px;">
                    <v-layout row>
                        <p class="text-xs-center headline"><br><br>Please select at least one category</p>
                    </v-layout>
                </v-layout>

                <v-layout v-else column wrap align-center justify-center class="text-xs-center"
                          style="margin-top: 200px;">
                    <v-layout row>
                        <v-progress-circular :size="100" :width="10" color="white" indeterminate
                        ></v-progress-circular>
                    </v-layout>
                    <v-layout row>
                        <p class="text-xs-center headline"><br><br>Looking for Hot Searches</p>
                    </v-layout>

                </v-layout>
            </v-container>
        </v-content>
        <v-footer :class="dark ? 'drawer-dark' : 'drawer-light'" app>
            <span class="px-3">&copy; AMZ Hot Searches {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
    import KeywordPanel from './components/KeywordPanel'
    import alexaProvider from './alexaProvider'
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
            disableRegularCategories: false,
            disableAllCategories: false,
            scheduleRefresh: false,
            resultsReady: false,
            results: [],
            queries: [],
            selectedCategories: [],
            loadingProgress: 0,
            categories: [
                {
                    name: 'Deals',
                    alias: 'deals-intl-ship',
                    value: false,
                    exclusive: true,
                },
                {
                    name: 'All Departments',
                    alias: 'aps',
                    value: false,
                    exclusive: true,
                },
                {
                    title: 'Books',
                    divider: true
                },
                {
                    name: 'Books',
                    alias: 'stripbooks-intl-ship',
                    value: false
                },
                {
                    name: 'Kindle Store',
                    alias: 'digital-text',
                    value: false
                },
                {
                    title: 'Music',
                    divider: true
                },
                {
                    name: 'Music, CDs & Vinyl',
                    alias: 'music-intl-ship',
                    value: true
                },
                {
                    name: 'Digital Music',
                    alias: 'digital-music',
                    value: true
                },
                {
                    title: 'Video',
                    divider: true
                },
                {
                    name: 'Prime Video',
                    alias: 'instant-video',
                    value: false
                },
                {
                    name: 'Movies & TV',
                    alias: 'movies-tv-intl-ship',
                    value: false
                },
                {
                    title: 'Games',
                    divider: true
                },
                {
                    name: 'Video Games',
                    alias: 'videogames-intl-ship',
                    value: false
                },
                {
                    name: 'Toys & Games',
                    alias: 'toys-and-games-intl-ship',
                    value: false
                },
            ],
            dark: true,
            primaryDrawer: {
                model: false,
            },
        }),
        mounted() {
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/http://completion.amazon.com/search';

            this.selectedCategories = this.categories.filter(c => !c.divider && c.value).map(c => c.alias);

            for (let i = 0; i < 26; i++) {
                const letter = (i + 10).toString(36);
                this.queries.push(letter);
            }

            this.scheduleRefresh = true;
            this.checkForRefresh();
        },

        methods: {
            checkForRefresh() {
                if (this.scheduleRefresh) {
                    this.scheduleRefresh = false;
                    this.getHotSearches();
                }
                setTimeout(this.checkForRefresh, 500);
            },
            getHotSearches(category) {
                if (this.disableAllCategories) {
                    this.scheduleRefresh = true;
                    return;
                }
                if (this.selectedCategories.length > 0) {
                    this.disableAllCategories = true;
                }
                this.results = [];
                const urlBase = 'complete?client=amazon-search-ui&mkt=1';

                this.resultsReady = false;
                this.loadingProgress = 0;
                let goalLength = this.selectedCategories.length * this.queries.length;
                let takeHalf = goalLength > 100;
                if (takeHalf) {
                    goalLength /= 2;
                }

                this.selectedCategories.slice().forEach(alias => {
                    this.queries.forEach((query, i) => {
                        if (this.scheduleRefresh || (takeHalf && i % 2 === 0)) {
                            return;
                        }
                        const url = urlBase + '&search-alias=' + alias + '&q=' + query;
                        axios.get(url).then(response => {
                            const data = response.data;
                            if (data[0] === query && data.length > 1) {
                                data[1].slice(0, 1).forEach(res => {
                                    if (!this.results.includes(res)) {
                                        let category = this.categories.filter((c) => c.alias === alias)[0].name;
                                        if (i % 15 === 0) {
                                            this.results.push({
                                                text: alexaProvider.getRandomCommand(),
                                                category: "Alexa Conversations",
                                                color: Math.floor(Math.random() * 10),
                                                alexa: true,
                                            });
                                        }

                                        this.results.splice(Math.floor(Math.random() * this.results.length), 0, {
                                            text: res,
                                            category: category,
                                            color: Math.floor(Math.random() * 10)
                                        })
                                    }
                                });
                            }
                            ++this.loadingProgress;
                            if (this.loadingProgress === goalLength) {
                                this.resultsReady = true;
                                this.disableAllCategories = false;
                            }
                        })
                    });
                });

                if (category && category.exclusive) {
                    if (this.selectedCategories.includes(category.alias)) {
                        this.disableRegularCategories = true;
                        this.selectedCategories = [category.alias];
                    } else {
                        this.selectedCategories = [];
                        this.disableRegularCategories = false;
                    }
                } else {
                    this.selectedCategories.forEach((c, i) => {
                        if (this.categories.filter((cat) => cat.alias === c && cat.exclusive).length > 0) {
                            this.selectedCategories.splice(i, 1)
                        }
                    });
                }
            }
        }
    }
</script>

<style>
    .main-light {
        background-color: #EAEDED;
    }

    .main-dark {
        background-color: #131A22;
    }

    .drawer-dark {
        background-color: #232F3F !important;
    }

    .drawer-light {
        background-color: #FFFFFF !important;
    }
</style>
