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
