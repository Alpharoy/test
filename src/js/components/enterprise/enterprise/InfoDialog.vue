<template>
    <el-dialog title="企业资料" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               class="ql-dialog">
        <el-form label-width="120px" auto-complete="off">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" required>
                            <el-input :value="enterprise.enterprise_name" maxlength="32"
                                      placeholder="请输入公司名称" disabled></el-input>
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
                            <el-input :value="enterprise.usci_number" maxlength="32"
                                      placeholder="请输入统一信用代码" disabled></el-input>
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
                                    :file-list="businessLicensePhoto"
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
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">关闭</el-button>
            <el-button type="primary" @click="submitFunc">更新</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import helpers from '../../../extends/helpers';
    import UrAreaCascader from '../../../components/UrAreaCascader';
    import PictureUpload from '../../../components/PictureUpload';

    export default {
        name: 'InfoDialog',
        components: {UrAreaCascader, PictureUpload},
        data: () => ({
            elVisible: false,
            industryTypes: helpers.cons('common.industry_type'),
            certificateTypes: helpers.cons('common.certificate_type'),

            enterprise: {industry_type_code: '', artificial_person_certificate_type_code: ''},
            businessLicensePhoto: [],
        }),
        props: {
            enterpriseUuid: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            enterpriseUUID() {
                return this.enterpriseUuid;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_enterprise, {enterpriseUUID: this.enterpriseUUID})).then((response) => {
                    this.enterprise = response.data;
                    if (this.enterprise.business_license_photo) {
                        this.businessLicensePhoto = [{
                            name: this.enterprise.business_license_photo,
                            code: this.enterprise.business_license_photo,
                            url: helpers.getImageURL(this.enterprise.business_license_photo)
                        }];
                    }
                });
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['enterprise', 'businessLicensePhoto']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            businessLicensePhotoUploadSuccess(imageCode) {
                this.enterprise.business_license_photo = imageCode;
            },
            businessLicensePhotoUploadRemove() {
                this.enterprise.business_license_photo = '';
            },
            submitFunc() {
                api.enterprise().put(helpers.convertURL(enterpriseURL.update_enterprise, {enterpriseUUID: this.enterpriseUUID}), this.enterprise).then(() => {
                    this.$message({type: 'success', message: '企业信息更新成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
