<template>
    <v-container>
        <v-card style="padding: 20px; min-height: 350px; max-height: 350px;"
                :href="keywords[keyword].alexa ? 'https://www.amazon.com/b?node=17934671011' : 'https://www.amazon.com/s?k='+keywords[keyword].text" target="_blank"
                hover :light="(keywords[keyword].color % colors.length) < 1"
                :dark="(keywords[keyword].color % colors.length) >= 1"
                :class="'mx-auto elevation-0 ' + colors[keywords[keyword].color % colors.length]" max-width="400">
            <v-card-text style="min-height: 220px;" class="display-2 font-weight-bold">
                {{ keywords[keyword].text.slice(0, typeWriterIndex) }}
            </v-card-text>

            <v-card-actions>
                <v-list-tile class="grow">
                    <v-layout align-center>
                        <p class="text-xs-center title" style="margin-top: 80px;">In <b>{{ keywords[keyword].category }}</b></p>
                    </v-layout>
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
            setTimeout(this.typeWriter, Math.random() * 3000 + 800);
        },
        methods: {
            refresh() {
                let length = this.keywords[this.keyword].text.length * Math.max(Math.random() + 0.5, 1) * 600;
                if (this.typeWriterIndex === 0 || this.typeWriterIndex === this.keywords[this.keyword].text.length) {
                    this.keyword = Math.floor(Math.random() * this.keywords.length);
                    this.typeWriterIndex = 0;
                    setTimeout(this.typeWriter, Math.min(Math.random() + 0.5, 1) * 1000);
                }
                setTimeout(this.refresh, length);
            },
            typeWriter() {
                const text = this.keywords[this.keyword].text;
                if (this.typeWriterIndex < text.length) {
                    this.typeWriterIndex++;
                    this.typeWriterSpeed = this.typeWriterBaseSpeed + (Math.random() - 0.5) * 100;
                    setTimeout(this.typeWriter, this.typeWriterSpeed);
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
