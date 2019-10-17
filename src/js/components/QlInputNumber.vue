<template>
    <el-input
            ref="input"
            type="number"
            :step="elStep"
            :max="elMax"
            :min="elMin"
            :value="elValue"
            @blur="handleBlur"
            @focus="handleFocus"
            @input="handleInput"
            @change="handleInputChange"
            v-bind="$attrs"
    >
        <slot name="prepend" slot="prepend"></slot>
        <slot name="append" slot="append"></slot>
        <slot name="prefix" slot="prefix"></slot>
        <slot name="suffix" slot="suffix"></slot>
    </el-input>
</template>

<script>
    import Focus from 'element-ui/src/mixins/focus';

    const positiveIntegerValidator = function (val) {
        return val >= 0 && _.isSafeInteger(val);
    };

    export default {
        name: 'QlInputNumber',
        mixins: [Focus('input')],
        props: {
            step: {
                type: Number,
                default: 1,
                validator: positiveIntegerValidator
            },
            max: {
                type: Number,
                default: _.toSafeInteger(Infinity),
            },
            min: {
                type: Number,
                default: _.toSafeInteger(-Infinity),
            },
            value: {},
            multiple: {
                type: Number,
                default: 1,
                validator(val) {
                    return val >= 0;
                },
            },
            precision: {
                type: Number,
                default: 0,
                validator: positiveIntegerValidator
            },
            nullable: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                elValue: this.nullable ? null : '',
            };
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    const currentEmitValue = this.nullable && !this.elValue ? this.elValue : this.formatToEmitValue(this.elValue);
                    const formattedNewValue = this.nullable && !value ? value : this.formatWithPrecision(value, this.valuePrecision);

                    if (currentEmitValue !== formattedNewValue) {
                        this.elValue = this.formatToDisplayValue(formattedNewValue);
                        this.$emit('input', formattedNewValue);
                        this.$emit('change', formattedNewValue);
                    }
                }
            }
        },
        computed: {
            displayPrecision() {
                return this.precision;
            },
            valuePrecision() {
                return 0;
            },
            elStep() {
                if (this.step) {
                    return this.formatToDisplayValue(this.step);
                }
                return this.step;
            },
            elMax() {
                if (this.max) {
                    return this.formatToDisplayValue(this.max);
                }
                return this.max;
            },
            elMin() {
                if (this.min) {
                    return this.formatToDisplayValue(this.min);
                }
                return this.min;
            },
        },
        methods: {
            formatWithPrecision(num, precision) {
                return parseFloat(Number(num).toFixed(precision));
            },
            formatToDisplayValue(num) {
                if (this.nullable && !num) {
                    return num;
                }
                return this.formatWithPrecision(num * this.multiple, this.displayPrecision);
            },
            formatToEmitValue(num) {
                if (this.nullable && !num) {
                    return num;
                }
                return this.formatWithPrecision(num / this.multiple, this.valuePrecision);
            },
            handleBlur(event) {
                this.$emit('blur', event);

                // 截断后重新赋值
                if (!this.nullable || this.elValue) {
                    this.elValue = this.formatWithPrecision(this.elValue, this.displayPrecision);
                }
                //this.$refs.input.setCurrentValue(this.elValue);
            },
            handleFocus(event) {
                this.$emit('focus', event);
            },
            handleInput(value, ignoreZero = true) {
                this.$emit('input', this.handleElValueChange(value));
            },
            handleInputChange(value) {
                this.$emit('change', this.handleElValueChange(value));
            },
            handleElValueChange(newValue) {
                this.elValue = newValue;
                return this.formatToEmitValue(newValue);
            }
        },
        mounted() {
            // 初始化数据
            this.elValue = this.nullable && !this.value ? this.value : this.formatToDisplayValue(this.value);
        }
    };
</script>

<style scoped>
</style>