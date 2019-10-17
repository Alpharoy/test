<template>
    <el-dialog title="关于我们" width="600px" :visible="elVisible" @close="onClose" v-bind="$attrs" class="ql-dialog">
        <el-collapse :value="['20191016']">
            <el-collapse-item title="OJMS V1.0" name="20191016">
                1. 版本发布
            </el-collapse-item>
        </el-collapse>
    </el-dialog>
</template>
<script>
    export default {
        name: 'AdminVersion',
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                elVisible: false,
            };
        },

        computed: {},

        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },

        methods: {
            onClose() {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close');
            },
        },
    };
</script>
<style scoped>
</style>