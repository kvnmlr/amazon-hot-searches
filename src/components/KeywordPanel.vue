<template>
    <v-container>
        <v-card style="padding: 20px; min-height: 320px; max-height: 320px;"
                :href="'https://www.amazon.com/s?k='+keywords[keyword].text"
                target="_blank"
                hover
                :light="(keywords[keyword].color % colors.length) < 1"
                :dark="(keywords[keyword].color % colors.length) >= 1"
                :class="'mx-auto elevation-0 ' + colors[keywords[keyword].color % colors.length]" max-width="400">
            <v-card-text style="min-height: 220px;" class="display-2 font-weight-bold">
                {{ keywords[keyword].text.slice(0, typeWriterIndex) }}
                <!--{{ Math.floor(new Date().getMilliseconds() / 100) % 2 === 0 ? '|' : '' }}-->
            </v-card-text>

            <v-card-actions>
                <v-list-tile class="grow">
                    <v-layout align-center>
                        <p class="text-xs-center" style="margin-top: 30px;">In <b>{{ keywords[keyword].category }}</b></p>
                    </v-layout>
                    <!--<v-layout align-center justify-end>
                        <v-btn light :href="'https://www.amazon.com/s?k='+keywords[keyword].text"
                               class="subheading gradient-grey">
                            Seach!
                        </v-btn>
                    </v-layout>-->
                </v-list-tile>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            typeWriterIndex: 0,
            typeWriterBaseSpeed: 200,
            typeWriterSpeed: 200,
            keyword: 0,
            colors: ['white', 'mellowapricot', 'gunmetal', 'charcoal']
        }),
        props: {
            keywords: Array,
        },
        mounted() {
            this.refresh();
            setTimeout(this.typeWriter, Math.random() * 2000 + 800);
        },
        methods: {
            refresh() {
                let length = this.keywords[this.keyword].text.length * Math.max(Math.random() + 0.5, 1) * 800;
                if (this.typeWriterIndex === 0 || this.typeWriterIndex === this.keywords[this.keyword].text.length) {
                    this.keyword = Math.floor(Math.random() * this.keywords.length);
                    this.typeWriterIndex = 0;
                }
                setTimeout(this.refresh, length);
            },
            typeWriter() {
                const text = this.keywords[this.keyword].text;
                if (this.typeWriterIndex < text.length) {
                    this.typeWriterIndex++;
                    this.typeWriterSpeed = this.typeWriterBaseSpeed + (Math.random() - 0.5) * 100;
                }
                setTimeout(this.typeWriter, this.typeWriterSpeed);
            }
        }
    }
</script>

<style>
    .gradient-no-switch {
        flex: 1 1 auto;
        transition: 0.5s;
        background-size: 200% auto;
    }

    .gunmetal {
        background-image: linear-gradient(to top, #232F3F 0%, #232F3F 51%, #232F3F 100%);
        background-color: #232F3F;
    }

    .mellowapricot {
        background-image: linear-gradient(to top, #FEBD69 0%, #FEBD69 51%, #FEBD69 100%);
        background-color: #FEBD69;
    }

    .charcoal {
        background-image: linear-gradient(to top, #37475A 0%, #37475A 51%, #37475A 100%);
        background-color: #37475A;
    }

    .white {
        background-image: linear-gradient(to top, #FFFFFF 0%, #FFFFFF 51%, #FFFFFF 100%);
        background-color: #FFFFFF;
    }

    .gradient-yellow {
        background-image: linear-gradient(to top, #EDBA36 0%, #F1C964 51%, #F5D588 100%);
    }

    .gradient-grey {
        background-image: linear-gradient(to top, #DADDE2 0%, #EFF1F3 51%, #E6E9EF 100%);
    }
</style>
