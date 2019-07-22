<template>
    <v-app :dark="dark">
        <v-navigation-drawer :class="dark ? 'drawer-dark' : 'drawer-light'" v-model="primaryDrawer.model"
                             absolute overflow app temporary>
            <v-container>
                <h2>Theme</h2>
                <v-switch v-model="dark" label="Dark" color="#FEBD69"></v-switch>
                <v-divider style="margin-bottom: 15px"></v-divider>
                <h2>Categories</h2>
                <v-layout row wrap>
                    <v-flex xs12>
                        <div v-for="category in categories" v-bind:key="category.name">
                            <div v-if="category.divider">
                                <br>
                                <h3>{{category.title}}</h3>
                            </div>
                            <v-checkbox v-else :disabled="(!category.exclusive && disableRegularCategories)"
                                        v-model="selectedCategories" :label="category.name"
                                        :color="dark ? '#FEBD69' : '#232F3F'"
                                        hide-details :value="category.alias" @change="getHotSearches(category)">
                            </v-checkbox>
                        </div>
                    </v-flex>
                </v-layout>
                <v-divider style="margin: 15px"></v-divider>
                <span>
                    <v-btn flat @click="() => {dialog = true; primaryDrawer.model = false;}">About</v-btn>
                    <v-btn href="https://github.com/kvnmlr/amazon-hot-searches" target="_blank" flat>Source</v-btn>
                </span>
            </v-container>
        </v-navigation-drawer>

        <v-content :class="dark ? 'main-dark' : 'main-light'">
            <v-container fluid style="height: 100%;">
                <v-btn style="z-index: 2" fab light small color="white"
                       @click.stop="primaryDrawer.model = !primaryDrawer.model">
                    <v-icon dark>{{ primaryDrawer.model ? 'arrow_back' : 'arrow_forward' }}</v-icon>
                </v-btn>

                <v-container style="margin-top: -50px;"
                             v-if="this.results.length > 8 && this.resultsReady && !this.scheduleRefresh" fluid
                             fill-height fill-width
                             grid-list-md>
                    <v-layout row wrap align-center>
                        <v-flex v-for="(res, i) in results.slice(0, 8)" v-bind:key="i" xs12 sm12 md6 lg3>
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
                        <v-progress-circular :size="100" :width="10" color="#FEBD69" indeterminate
                        ></v-progress-circular>
                    </v-layout>
                    <v-layout row>
                        <p class="text-xs-center headline"><br><br>Looking for Hot Searches</p>
                    </v-layout>

                </v-layout>
            </v-container>
        </v-content>

        <v-dialog v-model="dialog" width="500">
            <v-card light>
                <v-card-title dark class="headline drawer-dark white--text" primary-title>
                    About AMZ Hot Searches
                </v-card-title>

                <v-card-text>
                    <p class="body-2">This website is developed as a personal project by a coding enthusiast and
                        Amazon fan. </p>
                    <p class="body-1">To retrieve the search queries, public Amazon APIs are used.
                        The service is neither developed or hosted by Amazon,
                        nor is it property of Amazon or any of its subsidiaries. The search queries are based on user
                        interest and are no paid ads. No affiliate links are used. Amazon Alexa queries are not
                        based on actual spoken queries and are only fictional and for entertainment purpose.</p>
                    <p class="body-1">
                        <b>Contact</b><br>
                        Kevin Müller<br>
                        kevin.mueller@gmail.com<br>
                        <a href="https://github.com/kvnmlr" target="_blank" style="text-decoration: none">My GitHub</a>
                        <br>
                        <a href="https://www.linkedin.com/in/kevin-m%C3%BCller/" target="_blank"
                           style="text-decoration: none">LinkedIn</a>
                    </p>
                    <p class="body-1">
                        <b>Support</b><br>
                        <v-icon small>star</v-icon>&nbsp;<a href="https://github.com/kvnmlr/amazon-hot-searches"
                                                            style="text-decoration: none"
                                                            target="_blank">Star the repository on GitHub</a><br>
                        <v-icon small>favorite</v-icon>&nbsp;<a href="https://github.com/kvnmlr"
                                                                style="text-decoration: none"
                                                                target="_blank">Become a GitHub Sponsor</a><br></p>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-footer :class="dark ? 'drawer-dark' : 'drawer-light'" app>
            <span class="px-3">&copy; AMZ Hot Searches {{ new Date().getFullYear() }},<a
                    style="color: white; text-decoration: none" @click="dialog = true"> About</a> </span>
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
            dialog: false,
            disableRegularCategories: false,
            refreshOngoing: false,
            scheduleRefresh: false,
            resultsReady: false,
            results: [],
            queries: [],
            selectedCategories: [],
            loadingProgress: 0,
            categories: [
                /*{
                    name: 'Deals',
                    alias: 'deals-intl-ship',
                    value: false,
                    exclusive: true,
                },*/
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
                    value: true
                },
                {
                    name: 'Kindle Store',
                    alias: 'digital-text',
                    value: true
                },
                {
                    title: 'Music',
                    divider: true
                },
                {
                    name: 'Music, CDs & Vinyl',
                    alias: 'music-intl-ship',
                    value: false
                },
                {
                    name: 'Digital Music',
                    alias: 'digital-music',
                    value: false
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
            cached: {},
            primaryDrawer: {
                model: false,
            },
        }),
        mounted() {
            console.log('%cHey developers! Check out the repository:\nhttps://github.com/kvnmlr/amazon-hot-searches ', 'color: #FEBD69; font-size: 14pt;');

            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

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
                // Currently, a refresh is ongoing, don't continue but schedule another refresh
                if (this.refreshOngoing) {
                    this.scheduleRefresh = true;
                    return;
                }

                // If an exclusive category is selected, all other categories should be unselected and disabled
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

                if (this.selectedCategories.length > 0) {
                    this.refreshOngoing = true;
                }
                this.results = [];          // clear all queries
                this.resultsReady = false;  // show the loading indicator
                this.loadingProgress = 0;   // keep track of finished API requests

                const urlBase = 'https://cors-anywhere.herokuapp.com/http://completion.amazon.com/search/complete?client=amazon-search-ui&mkt=1';
                const takeResults = 2;

                // determine how many requests should be made in total.
                // If the number exceeds 100, only every other letter is taken
                let goalLength = this.selectedCategories.length * this.queries.length;
                let takeHalf = goalLength > 100;
                if (takeHalf) {
                    goalLength /= 2;
                }

                // For each category and for each letter, make an API request and add the best two result queries
                this.selectedCategories.slice().forEach((alias, i) => {
                    // If we have retrieved this categorie earlier, use the cached results
                    if (this.cached[alias]) {
                        setTimeout(() => {
                            // Push each of the cached results to the current result list
                            this.cached[alias].forEach((a, i) => {
                                if (i % takeResults === 0) {
                                    ++this.loadingProgress;
                                }
                                this.results.splice(Math.floor(Math.random() * this.results.length), 0, a)
                            });

                            // Finalize results if there is no further category selected
                            if (i === this.selectedCategories.length - 1) {
                                this.resultsReady = true;
                                this.refreshOngoing = false;
                            }
                        }, 1);
                        return;
                    }

                    // This category has not been retrieved yet. Create a new cache and load the results
                    this.cached[alias] = [];
                    this.queries.forEach((query, i) => {
                        if (this.scheduleRefresh || (takeHalf && i % 2 === 0)) {
                            return;
                        }
                        const url = urlBase + '&search-alias=' + alias + '&q=' + query;
                        axios.get(url).then(async response => {
                            let data = response.data;
                            if (!data || data[0] !== query || data.length <= 1) {
                                await axios.get('http://localhost:3000/api/amz' + '?search-alias=' + alias + '&q=' + query)
                                    .then(function (response) {
                                        // handle success
                                        data = response.data;
                                    })
                                    .catch(function (error) {
                                        // handle error
                                        console.log(error);
                                        data = undefined;
                                    })
                            }
                            if (data.length) {
                                axios.post('http://localhost:3000/api/amz' + '?search-alias=' + alias + '&q=' + query, data);
                                data[1].slice(0, takeResults).forEach(res => {
                                    if (!this.results.includes(res)) {
                                        const category = this.categories.filter((c) => c.alias === alias)[0].name;
                                        const result = {
                                            text: res,
                                            category: category,
                                            color: Math.floor(Math.random() * 10)
                                        };
                                        this.results.splice(Math.floor(Math.random() * this.results.length), 0, result);
                                        this.cached[alias].push(result);
                                    }
                                });
                            }

                            ++this.loadingProgress;

                            // Check if all requests are done
                            if (this.loadingProgress >= goalLength) {
                                this.resultsReady = true;
                                this.refreshOngoing = false;
                            }
                        })
                    });
                });
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

    .dialog-mellow {
        background-color: #FEBD69 !important;
    }

    .drawer-light {
        background-color: #FFFFFF !important;
    }
</style>
