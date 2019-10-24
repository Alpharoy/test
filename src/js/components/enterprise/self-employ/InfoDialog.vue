<template>
    <el-dialog title="个体户详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs"
               width="1200px"
               class="ql-dialog">
        <el-form label-width="120px" auto-complete="off" :disabled="true">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称">
                            <el-input :value="selfEmploy.self_employ_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行业类型">
                            <el-input :value="selfEmploy.industry_type_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在区域">
                            <el-input :value="selfEmploy.location_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="统一信用代码">
                            <el-input :value="selfEmploy.usci_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="企业法人">
                            <el-input :value="selfEmploy.artificial_person_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人手机号码">
                            <el-input :value="selfEmploy.artificial_person_phone_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件类型">
                            <el-input :value="selfEmploy.artificial_person_certificate_type_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="法人证件号码">
                            <el-input :value="selfEmploy.artificial_person_certificate_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input :value="selfEmploy.email"></el-input>
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
                        <el-form-item label="公司营业执照">
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    :file-list="businessLicensePhoto" disbaled></picture-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="营业地址">
                                    <el-input :value="selfEmploy.business_address"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业电话">
                                    <el-input :value="selfEmploy.telephone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="经营范围">
                                    <el-input :value="selfEmploy.business_scope"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业联系人">
                                    <el-input :value="selfEmploy.contact_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人手机">
                                    <el-input :value="selfEmploy.contact_phone_number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="公司介绍">
                                    <el-input type="textarea" :value="selfEmploy.introduce"></el-input>
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
                        <el-form-item label="税号">
                            <el-input :value="selfEmploy.tax_identification_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票抬头">
                            <el-input :value="selfEmploy.invoice_title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户银行">
                            <el-input :value="selfEmploy.bank_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行账号">
                            <el-input :value="selfEmploy.bank_account"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话号码">
                            <el-input :value="selfEmploy.bank_reserve_mobile_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位地址">
                            <el-input :value="selfEmploy.invoice_address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import enterpriseURL from '../../../api/url/enterprise';
    import PictureUpload from '../../PictureUpload';

    export default {
        name: 'InfoDialog',
        components: {PictureUpload},
        data: () => ({
            elVisible: false,
            selfEmploy: {industry_type_code: '', artificial_person_certificate_type_code: ''},
            businessLicensePhoto: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            selfEmployUuid: {
                type: String,
            },
        },
        computed: {
            selfEmployUUID() {
                return this.selfEmployUuid;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_enterprise_self_employ, {selfEmployUUID: this.selfEmployUUID})).then((response) => {
                    this.selfEmploy = response.data.self_employ;
                    if (this.selfEmploy.business_license_photo) {
                        this.businessLicensePhoto = [{
                            name: this.selfEmploy.business_license_photo,
                            code: this.selfEmploy.business_license_photo,
                            url: helpers.getImageURL(this.selfEmploy.business_license_photo)
                        }];
                    }
                });
            },
            onClose(refresh = false) {
                // 避免打开时，看到部分展示的动画，故还原数据在此进行
                helpers.restoreDataToDefault(this, ['selfEmploy']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
        },
    };
</script>
<style lang="scss" scoped>
</style>