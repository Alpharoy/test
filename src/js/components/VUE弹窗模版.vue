<template>
    <el-dialog title="" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog">
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../api';
    import helpers from '../extends/helpers';

    // 这几个文件看哪个模块调用就引用哪个
    import adminURL from '../api/url/admin';
    import enterpriseURL from '../api/url/enterprise';
    import supplierURL from '../api/url/supplier';

    export default {
        name: 'DialogTemplate',
        components: {},
        data: () => ({
            elVisible: false,
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        computed: {},
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {

            },
        },
    };
</script>
<style scoped>
</style>