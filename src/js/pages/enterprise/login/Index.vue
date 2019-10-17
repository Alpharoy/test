<template>
    <div class="login-container">
        <div class="loading" v-show="loading"><i class="el-icon-loading"></i></div>
        <h1 class="title">OJMS - 企业管理后台</h1>
        <div class="login-form">
            <div class="logo">

            </div>
            <div class="form">
                <h2 class="title">用户登录</h2>
                <el-form size="big">
                    <el-form-item>
                        <el-input maxlength="11" placeholder="登录账号" v-model="form.account">
                            <fa-icon slot="suffix" icon="user"></fa-icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="password" maxlength="32" placeholder="登录密码" v-model="form.password">
                            <fa-icon slot="suffix" icon="lock"></fa-icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input maxlength="4" placeholder="图形验证码" v-model="form.verify_code" class="verify_code"
                                  @keyup.enter.native="login">
                            <template slot="append">
                        <span class="verify_code_span"><img :src="verifyCodeSrc" title="点击刷新验证码"
                                                            @click="refreshVerify"/></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" style="width: 100%" @click="login" size="big">登 录</el-button>
                    <el-button type="text" style="margin-left: -190px;" @click="showRegisterDialog = true">企业注册
                    </el-button>
                </el-form>
            </div>
        </div>
        <a v-show="false" href="http://www.miibeian.gov.cn/" target="_blank" class="copyright">粤ICP备XXX号</a>
        <enterprise-register-dialog :visible.sync="showRegisterDialog" :token="token"
                                    @close="closeRegisterDialogFunc"></enterprise-register-dialog>
    </div>
</template>
<script>
    import api from '../../../api';
    import commonURL from '../../../api/url/common';
    import enterpriseURL from '../../../api/url/enterprise';
    import helpers from '../../../extends/helpers';
    import EnterpriseRegisterDialog from '../../../components/enterprise/register/EnterpriseRegisterDialog';

    export default {
        name: 'LoginIndex',
        components: {EnterpriseRegisterDialog},
        data: () => ({
            loading: true,
            form: {
                account: '',
                password: '',
                verify_code: '',
            },
            verifyCodeSrc: '',
            token: '',

            showRegisterDialog: false,
        }),
        computed: {},
        created() {
            this.init();
        },
        methods: {
            init() {
                api.common().post(helpers.convertURL(commonURL.token), {}, {useLoading: false}).then(response => {
                    this.token = response.data.token;
                    this.$store.dispatch('setApiToken', this.token);
                    this.refreshVerify();
                    this.loading = false;
                }).catch(err => {
                });
            },
            refreshVerify() {
                this.verifyCodeSrc = api.common().defaults.baseURL + helpers.convertURL(commonURL.verify_code) + '?token=' + this.token + '&_=' + _.now();
            },
            login() {
                this.loading = true;
                api.enterprise().post(helpers.convertURL(enterpriseURL.login), this.form, {useLoading: false}).then(response => {
                    this.$message({type: 'success', message: '登录成功'});

                    // 用户信息存储在storage
                    localStorage.user = JSON.stringify(response.data.user);

                    const token = response.data.token;
                    this.$store.dispatch('setApiToken', token);
                    this.$router.replace({name: 'dashboard'});
                }).catch(err => {
                    this.form.verify_code = '';
                    this.refreshVerify();
                }).finally(() => {
                    this.loading = false;
                });
            },
            closeRegisterDialogFunc() {
                this.form.verify_code = '';
                this.refreshVerify();
            },
        },
    };
</script>
<style>
    html, body {
        min-width: 0 !important;
    }
</style>
<style lang="scss" scoped>
    .loading {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, .7);
        z-index: 9999;

        .el-icon-loading {
            position: relative;
            top: 50%;
            left: 50%;
            margin-top: -25px;
            margin-left: -25px;
            font-size: 50px;
        }
    }

    .login-container {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(-69deg, #1784f4, #15abf9);
        background-size: 100% auto;
        overflow: hidden;

        > .title {
            margin-top: 100px;
            color: white;
            text-align: center;
        }

        .login-form {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            width: 540px;
            margin: 0 auto;
            padding: 30px 30px 10px 30px;
            background: white;
            border-radius: 12px;
            overflow: hidden;

            .form {
                margin-left: 60px;

                .title {
                    margin-top: 0;
                    margin-bottom: 30px;
                    text-align: center;
                    color: #4c8adc;
                    text-shadow: 1px 1px 2px rgba(#4c8adc, 0.5);
                }
            }
        }
    }

    .verify_code {
        /deep/ .el-input-group__append {
            padding: 0;
            overflow: hidden;
        }

        .verify_code_span {
            width: auto;
            height: 38px;
            overflow: hidden;
            display: block;
        }

        img {
            width: auto;
            height: 100%;
            cursor: pointer;
        }
    }

    .copyright {
        position: fixed;
        bottom: 10px;
        right: 10px;
        color: #333;
        text-decoration: none;
    }
</style>