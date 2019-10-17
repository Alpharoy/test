<template>
    <el-dialog title="发送短信验证码" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="400px"
               class="ql-dialog" append-to-body>
        <el-form label-width="100px" auto-complete="off">
            <el-form-item label="手机号码">
                <el-input :value="userPhone" disabled></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input maxlength="4" placeholder="图形验证码" v-model="verifyCode" class="verify_code">
                    <template slot="append">
                            <span class="verify_code_span">
                                <img :src="verifyCodeSrc" title="点击刷新验证码" @click="refreshVerify"/></span>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc">发送</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import commonURL from '../../../api/url/common';
    import supplierURL from '../../../api/url/supplier';

    export default {
        name: 'SendSmsCodeDialog',
        components: {},
        data: () => ({
            elVisible: false,
            verifyCode: '',
            verifyCodeSrc: '',
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            token: {
                type: String,
            },
            userPhone: {
                type: String
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
                helpers.restoreDataToDefault(this, ['verifyCode', 'verifyCodeSrc']);
                this.refreshVerify();
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                api.supplier().post(helpers.convertURL(supplierURL.register_send_sms_code), {
                    user_phone: this.userPhone,
                    verify_code: this.verifyCode
                }).then(() => {
                    this.$emit('sendSms');
                    this.onClose();
                }).catch(() => {
                    this.refreshVerify();
                });
            },
            refreshVerify() {
                this.verifyCodeSrc = api.common().defaults.baseURL + helpers.convertURL(commonURL.verify_code) + '?token=' + this.token + '&_=' + _.now();
            },
        },
    };
</script>
<style lang="scss" scoped>
    .verify_code {
        /deep/ .el-input-group__append {
            padding: 0;
            overflow: hidden;
        }

        .verify_code_span {
            width: auto;
            height: 30px;
            overflow: hidden;
            display: block;
        }

        img {
            width: auto;
            height: 100%;
            cursor: pointer;
        }
    }
</style>