<template>
    <el-dialog title="企业注册" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog" top="30px">
        <div class="loading" v-show="loading"><i class="el-icon-loading"></i></div>
        <send-sms-code-dialog :visible.sync="showSendSmsCodeDialog" :token="token"
                              :user-phone="user.user_phone" @sendSms="sendSmsSuccessFunc"></send-sms-code-dialog>
        <el-row v-show="step === 'one'">
            <el-col :span="8" :offset="8">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="姓名">
                        <el-input v-model="user.user_name" maxlength="16" placeholder="请输入注册人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="user.user_phone" maxlength="11" placeholder="请输入注册手机号码"
                                  :disabled="!!smsTimer">
                            <el-button slot="append" @click="sendSmsCodeFunc">{{ sendSmsTips }}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="短信验证码">
                        <el-input v-model="user.sms_code" maxlength="16" placeholder="请输入收到的手机短信验证码"></el-input>
                    </el-form-item>
                    <el-form-item label="设定密码">
                        <el-input v-model="user.password" type="password" maxlength="32"
                                  placeholder="请输入注册密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="user.password_confirmation" type="password" maxlength="32"
                                  placeholder="请再次输入注册密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%" @click="nextStepFunc">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-form label-width="120px" auto-complete="off" v-show="step === 'two'">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" required>
                            <el-input v-model="enterprise.enterprise_name" maxlength="32"
                                      placeholder="请输入公司名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行业类型">
                            <el-select v-model="enterprise.industry_type_code" placeholder="请选择" style="width: 100%;"
                                       clearable>
                                <el-option v-for="industryType in industryTypes" :label="industryType.name"
                                           :value="industryType.code" :key="industryType.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在区域">
                            <ur-area-cascader v-model="enterprise.location_code" :level="4"
                                              select-any-level></ur-area-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="统一信用代码" required>
                            <el-input v-model="enterprise.usci_number" maxlength="32"
                                      placeholder="请输入统一信用代码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="企业法人" required>
                            <el-input v-model="enterprise.artificial_person_name" maxlength="32"
                                      placeholder="请输入企业法人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人手机号码">
                            <el-input v-model="enterprise.artificial_person_phone_number" maxlength="11"
                                      placeholder="请输入法人手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件类型">
                            <el-select v-model="enterprise.artificial_person_certificate_type_code" placeholder="请选择"
                                       style="width: 100%;"
                                       clearable>
                                <el-option v-for="certificateType in certificateTypes" :label="certificateType.name"
                                           :value="certificateType.code" :key="certificateType.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件号码">
                            <el-input v-model="enterprise.artificial_person_certificate_number" maxlength="32"
                                      placeholder="请输入法人证件号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input v-model="enterprise.email" maxlength="32"
                                      placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>公司详情</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司营业执照" required>
                            <el-input v-model="enterprise.business_license_photo" type="hidden"
                                      style="display: none"></el-input>
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    @uploadSuccess="businessLicensePhotoUploadSuccess"
                                    @uploadRemove="businessLicensePhotoUploadRemove"></picture-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="营业地址">
                                    <el-input v-model="enterprise.business_address" maxlength="32"
                                              placeholder="请输入营业地址"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业电话">
                                    <el-input v-model="enterprise.telephone" maxlength="32"
                                              placeholder="请输入企业电话"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="经营范围">
                                    <el-input v-model="enterprise.business_scope" maxlength="64"
                                              placeholder="请输入经营范围"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业联系人" required>
                                    <el-input v-model="enterprise.contact_name" maxlength="32"
                                              placeholder="请输入企业联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人手机" required>
                                    <el-input v-model="enterprise.contact_phone_number" maxlength="11"
                                              placeholder="请输入企业联系人手机"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="公司介绍">
                                    <el-input type="textarea" v-model="enterprise.introduce" maxlength="255"
                                              placeholder="请输入公司介绍"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>发票信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="税号" required>
                            <el-input v-model="enterprise.tax_identification_number" maxlength="32"
                                      placeholder="请输入税号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票抬头" required>
                            <el-input v-model="enterprise.invoice_title" maxlength="64"
                                      placeholder="请输入发票抬头"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户银行" required>
                            <el-input v-model="enterprise.bank_name" maxlength="32"
                                      placeholder="请输入开户银行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行账号" required>
                            <el-input v-model="enterprise.bank_account" maxlength="32"
                                      placeholder="请输入银行账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话号码" required>
                            <el-input v-model="enterprise.bank_reserve_mobile_number" maxlength="11"
                                      placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位地址" required>
                            <el-input v-model="enterprise.invoice_address" maxlength="255"
                                      placeholder="请输入单位地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>管理员信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户账号" required>
                            <el-input :value="user.user_phone" maxlength="11" placeholder="请输入注册手机号码" disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设定密码" required>
                            <el-input :value="user.password" type="password" maxlength="32"
                                      placeholder="请输入注册密码" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="8">
                        <el-checkbox v-model="agreementChecked">我已仔细阅读《XXX用户协议》并承诺遵守协议内容</el-checkbox>
                    </el-col>
                    <el-col :span="8" :offset="8" style="margin-top: 10px; text-align: center">
                        <el-button type="primary" style="width: 50%" @click="registerFunc">提交</el-button>
                    </el-col>
                </el-row>
            </el-card>

        </el-form>
        <div slot="footer" class="dialog-footer">
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import enterpriseURL from '../../../api/url/enterprise';
    import SendSmsCodeDialog from './SendSmsCodeDialog';
    import UrAreaCascader from '../../UrAreaCascader';
    import PictureUpload from '../../PictureUpload';

    export default {
        name: 'EnterpriseRegisterDialog',
        components: {PictureUpload, UrAreaCascader, SendSmsCodeDialog},
        data: () => ({
            elVisible: false,
            loading: false,

            industryTypes: helpers.cons('common.industry_type'),
            certificateTypes: helpers.cons('common.certificate_type'),

            user: {user_phone: ''},

            smsTimer: null,
            sendSmsTips: '发送短信验证码',
            countDown: 60,

            showSendSmsCodeDialog: false,

            enterprise: {industry_type_code: '', artificial_person_certificate_type_code: ''},
            step: 'one',

            agreementChecked: false,
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            token: {
                type: String,
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
                helpers.restoreDataToDefault(this, ['user', 'enterprise', 'smsTimer', 'sendSmsTips', 'countDown', 'step', 'agreementChecked', 'loading']);
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            sendSmsCodeFunc() {
                if (this.smsTimer) {
                    return false;
                }
                if ((/^1[0-9]{10}$/).test(this.user.user_phone) === false) {
                    this.$message({type: 'error', message: '请输入正确的手机号码'});
                    return false;
                }
                this.showSendSmsCodeDialog = true;
            },
            sendSmsSuccessFunc() {
                this.countDown = 60;
                this.smsTimer = setInterval(() => {
                    if (this.countDown === 0) {
                        this.sendSmsTips = '发送短信验证码';
                        clearInterval(this.smsTimer);
                        this.smsTimer = null;
                        return;
                    }
                    this.sendSmsTips = '请' + this.countDown + '秒后重试';
                    this.countDown--;
                }, 1000);
            },
            nextStepFunc() {
                this.loading = true;
                api.enterprise().post(helpers.convertURL(enterpriseURL.register_verify_sms_code), this.user).then(() => {
                    this.step = 'two';
                }).finally(() => {
                    this.loading = false;
                });
            },
            registerFunc() {
                if (!this.agreementChecked) {
                    this.$message({type: 'error', message: '请先仔细阅读用户协议并同意协议内容'});
                    return false;
                }
                this.loading = true;
                api.enterprise().post(helpers.convertURL(enterpriseURL.register), this.enterprise).then(() => {
                    this.$message({type: 'error', message: '企业注册成功，请等待审核。审核成功后即可登录。', duration: 0});
                    this.onClose();
                }).finally(() => {
                    this.loading = false;
                });
            },
            businessLicensePhotoUploadSuccess(imageCode) {
                this.enterprise.business_license_photo = imageCode;
            },
            businessLicensePhotoUploadRemove() {
                this.enterprise.business_license_photo = '';
            },
        },
    };
</script>
<style lang="scss" scoped>
    .ql-dialog {
        .el-dialog {
            position: relative;

            .loading {
                position: absolute;
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
        }
    }
</style>