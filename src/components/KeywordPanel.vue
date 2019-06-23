<template>
    <v-container>
        <v-card v-if="keywordsLocal.length" style="padding: 20px; min-height: 350px; max-height: 350px;"
                :href="keywordsLocal[keyword].alexa ? 'https://www.amazon.com/b?node=17934671011' : 'https://www.amazon.com/s?k='+keywordsLocal[keyword].text"
                target="_blank"
                hover :light="(keywordsLocal[keyword].color % colors.length) < 1"
                :dark="(keywordsLocal[keyword].color % colors.length) >= 1"
                :class="'mx-auto elevation-0 ' + colors[keywordsLocal[keyword].color % colors.length]" max-width="400">
            <v-card-text style="min-height: 220px;" class="display-2 font-weight-bold">
                {{ keywordsLocal[keyword].text.slice(0, typeWriterIndex) }}<span v-if="typeWriterIndex < keywordsLocal[keyword].text.length"
                    style="text-decoration: none; font-style: normal;"
            >| </span>
            </v-card-text>

            <v-card-actions>
                <v-list-tile class="grow">
                    <v-layout align-center>
                        <p class="text-xs-center title" style="margin-top: 80px;">In <b>{{ keywords[keyword].category
                            }}</b></p>
                    </v-layout>
                </v-list-tile>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import alexaProvider from '../alexaProvider'

    export default {
        data: () => ({
            typeWriterIndex: 0,
            typeWriterBaseSpeed: 200,
            keyword: 0,
            colors: ['white', 'mellowapricot', 'gunmetal', 'charcoal'],
            keywordsLocal: [],
        }),
        props: {
            keywords: Array,
        },
        mounted() {
            this.keywordsLocal = [...this.keywords];
            this.refresh();
        },
        methods: {
            /**
             * Chooses a new query and starts the typewriting process
             */
            refresh() {
                const probability = 0.01;
                if (Math.random() < probability) {
                    // With a certain probability, add a alexa conversation next
                    const command = alexaProvider.getRandomCommand();
                    this.keywordsLocal[0] = {
                        text: command,
                        category: "Alexa Conversations",
                        color: Math.floor(Math.random() * 10),
                        alexa: true,
                    };
                    this.keyword = 0;
                } else {
                    // Randomly choose the next query
                    this.keyword = Math.floor(Math.random() * this.keywordsLocal.length);
                }

                // Reset the typewriter and start typing after a random amount of time between 0,3s and 1s
                this.typeWriterIndex = 0;
                setTimeout(this.typeWriter, Math.min(Math.random() + 0.3, 1) * 1000);
            },

            /**
             * Recursively prints the next character with varying typing speed
             */
            typeWriter() {
                const text = this.keywordsLocal[this.keyword].text;
                if (this.typeWriterIndex < text.length) {
                    // If the query is not completely written out, type the next character
                    this.typeWriterIndex++;
                    const speed = this.typeWriterBaseSpeed + (Math.random() - 0.5) * 200;
                    setTimeout(this.typeWriter, speed);
                } else {
                    // When the query is completed, wait 2 seconds to start with the next query
                    setTimeout(this.refresh, 2500);
                }
            }
        }
    }
</script>

<style>
    .gunmetal {
        background-color: #232F3F !important;
    }

    .mellowapricot {
        background-color: #FEBD69 !important;
    }

    .charcoal {
        background-color: #37475A !important;
    }

    .white {
        background-color: #FFFFFF !important;
    }
</style>
