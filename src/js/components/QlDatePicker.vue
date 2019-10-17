<template>
    <el-date-picker
            :value="elValue"
            @blur="onBlur"
            @focus="onFocus"
            @change="onChange"
            @input="onInput"
            v-bind="$attrs"
    ></el-date-picker>
</template>
<script>
    import {DateTime} from 'luxon'
    import helpers from '../extends/helpers';

    export default {
        name: 'QlDatePicker',

        props: {
            value: {
                type: [String, Date],
            },
        },
        data() {
            return {
                elValue: null,
            };
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    if (_.isDate(value)) {
                        // 如果提供的value是JSDate对象，则转换成rfc3339字符串后通知回去
                        this.elValue = value;

                        const rfc3339String = helpers.formatJSDateToRfc3339String(value);

                        this.$emit('input', rfc3339String);
                        this.$emit('change', rfc3339String);
                    } else if (_.isString(value) && value.length) {
                        // 如果提供的value是Rfc3339字符串，则将elValue转换成JSDate对象
                        this.elValue = DateTime.fromISO(value).toJSDate();
                    } else {
                        // 否则清空
                        this.elValue = null;
                    }
                }
            }
        },

        computed: {},

        methods: {
            onBlur() {
                this.$emit('blur', this);
            },

            onFocus() {
                this.$emit('focus', this);
            },

            onChange(date) {
                this.elValue = date;
                this.$emit('change', helpers.formatJSDateToRfc3339String(date));
            },

            onInput(date) {
                this.elValue = date;
                this.$emit('input', helpers.formatJSDateToRfc3339String(date));
            },
        },
    }
</script>
<style scoped>
</style>