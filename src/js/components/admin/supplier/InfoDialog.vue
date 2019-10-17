<template>
    <el-dialog title="供应商新增/编辑" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs"
               width="1200px"
               class="ql-dialog">
        <el-form label-width="120px" auto-complete="off" :disabled="isAudit">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" required>
                            <el-input v-model="supplier.supplier_name" maxlength="32"
                                      placeholder="请输入公司名称" :disabled="!creating"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行业类型">
                            <el-select v-model="supplier.industry_type_code" placeholder="请选择" style="width: 100%;"
                                       clearable>
                                <el-option v-for="industryType in industryTypes" :label="industryType.name"
                                           :value="industryType.code" :key="industryType.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在区域">
                            <ur-area-cascader v-model="supplier.location_code" :level="4"
                                              select-any-level></ur-area-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="统一信用代码" required>
                            <el-input v-model="supplier.usci_number" maxlength="32"
                                      placeholder="请输入统一信用代码" :disabled="!creating"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="企业法人" required>
                            <el-input v-model="supplier.artificial_person_name" maxlength="32"
                                      placeholder="请输入企业法人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人手机号码">
                            <el-input v-model="supplier.artificial_person_phone_number" maxlength="11"
                                      placeholder="请输入法人手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件类型">
                            <el-select v-model="supplier.artificial_person_certificate_type_code" placeholder="请选择"
                                       style="width: 100%;"
                                       clearable>
                                <el-option v-for="certificateType in certificateTypes" :label="certificateType.name"
                                           :value="certificateType.code" :key="certificateType.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件号码">
                            <el-input v-model="supplier.artificial_person_certificate_number" maxlength="32"
                                      placeholder="请输入法人证件号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input v-model="supplier.email" maxlength="32"
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
                            <el-input v-model="supplier.business_license_photo" type="hidden"
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
                                    <el-input v-model="supplier.business_address" maxlength="32"
                                              placeholder="请输入营业地址"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业电话">
                                    <el-input v-model="supplier.telephone" maxlength="32"
                                              placeholder="请输入企业电话"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="经营范围">
                                    <el-input v-model="supplier.business_scope" maxlength="64"
                                              placeholder="请输入经营范围"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业联系人" required>
                                    <el-input v-model="supplier.contact_name" maxlength="32"
                                              placeholder="请输入企业联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人手机" required>
                                    <el-input v-model="supplier.contact_phone_number" maxlength="11"
                                              placeholder="请输入企业联系人手机"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="公司介绍">
                                    <el-input type="textarea" v-model="supplier.introduce" maxlength="255"
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
                            <el-input v-model="supplier.tax_identification_number" maxlength="32"
                                      placeholder="请输入税号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票抬头" required>
                            <el-input v-model="supplier.invoice_title" maxlength="64"
                                      placeholder="请输入发票抬头"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户银行" required>
                            <el-input v-model="supplier.bank_name" maxlength="32"
                                      placeholder="请输入开户银行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行账号" required>
                            <el-input v-model="supplier.bank_account" maxlength="32"
                                      placeholder="请输入银行账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话号码" required>
                            <el-input v-model="supplier.bank_reserve_mobile_number" maxlength="11"
                                      placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位地址" required>
                            <el-input v-model="supplier.invoice_address" maxlength="255"
                                      placeholder="请输入单位地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card" v-if="creating">
                <div class="el-card-info-title">
                    <span>管理员信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户账号" required>
                            <el-input v-model="user.user_phone" maxlength="11" placeholder="请输入注册手机号码">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户姓名" required>
                            <el-input v-model="user.user_name" maxlength="16" placeholder="请输入注册用户姓名">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设定密码" required>
                            <el-input v-model="user.password" type="password" maxlength="32"
                                      placeholder="请输入注册密码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc" v-if="!isAudit">确定</el-button>
            <el-button type="primary" @click="auditPassedFunc" v-if="isAudit && supplier.can_audit_passed">审核通过
            </el-button>
            <el-button type="danger" @click="auditFailedFunc" v-if="isAudit && supplier.can_audit_failed">审核不通过
            </el-button>
            <el-button type="warning" @click="reverseAuditFunc" v-if="isAudit && supplier.can_reverse_audit">撤销审核
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import adminURL from '../../../api/url/admin';
    import UrAreaCascader from '../../UrAreaCascader';
    import PictureUpload from '../../PictureUpload';

    export default {
        name: 'InfoDialog',
        components: {PictureUpload, UrAreaCascader},
        data: () => ({
            elVisible: false,

            industryTypes: helpers.cons('common.industry_type'),
            certificateTypes: helpers.cons('common.certificate_type'),

            supplier: {industry_type_code: '', artificial_person_certificate_type_code: ''},
            user: {},
            businessLicensePhoto: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            supplierUuid: {
                type: String,
            },
            type: {
                type: String,
            },
        },
        computed: {
            supplierUUID() {
                return this.supplierUuid;
            },
            creating() {
                return !this.supplierUUID;
            },
            isAudit() {
                return this.type === 'audit';
            }
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                if (!this.creating) {
                    api.admin().get(helpers.convertURL(adminURL.get_supplier, {supplierUUID: this.supplierUUID})).then((response) => {
                        this.supplier = response.data;
                        if (this.supplier.business_license_photo) {
                            this.businessLicensePhoto = [{
                                name: this.supplier.business_license_photo,
                                code: this.supplier.business_license_photo,
                                url: helpers.getImageURL(this.supplier.business_license_photo)
                            }];
                        }
                    });
                }
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['user', 'supplier', 'businessLicensePhoto']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                if (this.creating) {
                    api.admin().post(helpers.convertURL(adminURL.add_supplier), {
                        supplier: this.supplier,
                        user: this.user
                    }).then(() => {
                        this.$message({type: 'success', message: '新增供应商成功'});
                        this.onClose(true);
                    });
                } else {
                    api.admin().put(helpers.convertURL(adminURL.update_supplier, {supplierUUID: this.supplierUUID}), this.supplier).then(() => {
                        this.$message({type: 'success', message: '编辑供应商成功'});
                        this.onClose(true);
                    });
                }
            },
            businessLicensePhotoUploadSuccess(imageCode) {
                this.supplier.business_license_photo = imageCode;
            },
            businessLicensePhotoUploadRemove() {
                this.supplier.business_license_photo = '';
            },
            auditPassedFunc() {
                this.$confirm('将审核供应商成功，审核完成后不能撤销', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(99);
                }).catch(() => {
                });
            },
            auditFailedFunc() {
                this.$confirm('将审核供应商状态为失败，确定吗？', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(80);
                }).catch(() => {
                });
            },
            reverseAuditFunc() {
                this.$confirm('将撤销审核状态，撤销完成后可继续审核', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(10);
                }).catch(() => {
                });
            },
            auditFunc(auditStatus) {
                api.admin().post(helpers.convertURL(adminURL.supplier_audit_status, {supplierUUID: this.supplierUUID}), {
                    audit_status: auditStatus
                }).then(() => {
                    this.$message({type: 'success', message: '审核供应商完成'});
                    this.onClose(true);
                })
            },
        },
    };
</script>
<style lang="scss" scoped>
</style>