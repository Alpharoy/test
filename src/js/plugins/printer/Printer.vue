<template>
    <div id="print-container" class="print-container"></div>
</template>

<script>
    export default {
        name: "Printer",

        data() {
            return {
                printing: false,
            };
        },

        methods: {
            print(target) {
                const element = _.get(target, '$el', target);
                if (!_.isElement(element)) {
                    console.warn('Target is not html element.');
                    return;
                }

                // 替换当前打印内容
                this.$el.innerHTML = element.outerHTML;

                // 开始打印
                this.$nextTick(() => {
                    window.print();
                });
            },

            onBeforePrint() {
                if (!this.printing) {
                    this.printing = true;
                }
            },

            onAfterPrint() {
                if (this.printing) {
                    this.printing = false;
                }
            },
        },

        created() {
            if (window.matchMedia) {
                window.matchMedia('print').addEventListener('change', event => {
                    if (event.matches) {
                        this.onBeforePrint();
                    } else {
                        this.onAfterPrint();
                    }
                });
            }

            window.onbeforeprint = this.onBeforePrint;
            window.onafterprint = this.onAfterPrint;
        },
    }
</script>

<style lang="scss">
    #print-container {
        display: none !important;
    }

    @media print {
        body > * {
            display: none !important;
        }

        #print-container {
            display: block !important;
        }
    }

    @page {
        margin: 0;
    }
</style>