<template>
    <el-dialog title="自然人新增/编辑" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs"
               width="1200px"
               class="ql-dialog">
        <bank-card-info-dialog :visible.sync="showBankCardDialog" :user-uuid="uuid" :bank-card-uuid="dialogBankCardUUID"
                               :natural-person="naturalPerson" @close="closeBankCardDialogFunc"></bank-card-info-dialog>
        <el-form label-width="120px" auto-complete="off" :disabled="isAudit">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>身份证件</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证正面" required>
                            <el-input v-model="naturalPerson.certificate_photo_front" type="hidden"
                                      style="display: none"></el-input>
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    :file-list="certificatePhotoFront"
                                    @uploadSuccess="certificatePhotoFrontUploadSuccess"
                                    @uploadRemove="certificatePhotoFrontUploadRemove"
                                    :disabled="isAudit"></picture-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证背面" required>
                            <el-input v-model="naturalPerson.certificate_photo_back" type="hidden"
                                      style="display: none"></el-input>
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    :file-list="certificatePhotoBack"
                                    @uploadSuccess="certificatePhotoBackUploadSuccess"
                                    @uploadRemove="certificatePhotoBackUploadRemove"
                                    :disabled="isAudit"></picture-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名" required>
                            <el-input v-model="naturalPerson.user_name" maxlength="32"
                                      placeholder="用户姓名" :disabled="!creating"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="登录账号" required>
                            <el-input v-model="naturalPerson.user_phone" maxlength="11"
                                      placeholder="请输入手机号码作为登录账号" :disabled="!creating"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="creating">
                        <el-form-item label="登录密码" required>
                            <el-input v-model="naturalPerson.password" maxlength="32" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="证件号码" required>
                            <el-input v-model="naturalPerson.id_card_number" maxlength="18"
                                      placeholder="请输入身份证号码" :disabled="!creating"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="!creating">
                        <el-form-item label="性别">
                            <el-input :value="naturalPerson.sex_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="!creating">
                        <el-form-item label="生日">
                            <ql-date-picker type="date" :value="naturalPerson.birthday" style="width: 100%;"
                                            disabled></ql-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="联系地址" required>
                            <el-input v-model="naturalPerson.contact_address" placeholder="联系地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="!creating">
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-input :value="naturalPerson.status_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="注册时间">
                            <ql-date-picker type="datetime" :value="naturalPerson.create_time" style="width: 100%;"
                                            disabled></ql-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户来源">
                            <el-input :value="naturalPerson.source_from_name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card" v-if="!creating">
                <div class="el-card-info-title">
                    <span>绑定银行卡</span>
                </div>
                <el-button type="primary" @click="bankCardInfoFunc('')" style="margin-bottom: 10px;" v-if="!isAudit">
                    绑定银行卡
                </el-button>
                <el-card-table :list-data="bankCardListData">
                    <el-table-column prop="bank_card_uuid" label="UUID" width="140"/>
                    <el-table-column prop="bank_name" label="银行名称"/>
                    <el-table-column prop="card_number" label="银行卡卡号" width="200"/>
                    <el-table-column prop="card_holder" label="持卡人"/>
                    <el-table-column prop="card_holder_phone" label="预留手机号" width="120"/>
                    <el-table-column label="默认" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.is_default ? '√' :'×'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="验证" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.is_verified ? '√' :'×'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="添加时间" width="150">
                        <template slot-scope="scope">
                            {{scope.row.create_time | qlDateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100" v-if="!isAudit">
                        <template slot-scope="scope">
                            <el-button type="text" @click="bankCardInfoFunc(scope.row.bank_card_uuid)">编辑</el-button>
                            <el-button type="text" @click="deleteBankCardFunc(scope.row.bank_card_uuid)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-card-table>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc" v-if="!isAudit">确定</el-button>
            <el-button type="primary" @click="auditPassedFunc" v-if="isAudit && naturalPerson.can_audit_passed">审核通过
            </el-button>
            <el-button type="danger" @click="auditFailedFunc" v-if="isAudit && naturalPerson.can_audit_failed">审核不通过
            </el-button>
            <el-button type="warning" @click="reverseAuditFunc" v-if="isAudit && naturalPerson.can_reverse_audit">撤销审核
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import adminURL from '../../../api/url/admin';
    import QlDatePicker from '../../QlDatePicker';
    import PictureUpload from '../../PictureUpload';
    import ElCardTable from '../../table/ElCardTable';
    import BankCardInfoDialog from './BankCardInfoDialog';

    export default {
        name: 'InfoDialog',
        components: {BankCardInfoDialog, ElCardTable, PictureUpload, QlDatePicker},
        data: () => ({
            elVisible: false,
            naturalPerson: {password: '123456'},
            certificatePhotoFront: [],
            certificatePhotoBack: [],

            bankCardListData: {
                data: [],
                page: {
                    currentPage: 1,
                },
            },
            dialogBankCardUUID: '',
            showBankCardDialog: false,
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            uuid: {
                type: String,
            },
            type: {
                type: String,
            },
        },
        computed: {
            creating() {
                return !this.uuid;
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
                    api.admin().get(helpers.convertURL(adminURL.get_natural_person, {userUUID: this.uuid})).then((response) => {
                        this.naturalPerson = response.data;
                        if (this.naturalPerson.certificate_photo_front) {
                            this.certificatePhotoFront = [{
                                name: this.naturalPerson.certificate_photo_front,
                                code: this.naturalPerson.certificate_photo_front,
                                url: helpers.getImageURL(this.naturalPerson.certificate_photo_front)
                            }];
                        }
                        if (this.naturalPerson.certificate_photo_back) {
                            this.certificatePhotoBack = [{
                                name: this.naturalPerson.certificate_photo_back,
                                code: this.naturalPerson.certificate_photo_back,
                                url: helpers.getImageURL(this.naturalPerson.certificate_photo_back)
                            }];
                        }
                    });
                    this.fetchBankCard();
                }
            },
            onClose(refresh = false) {
                // 避免打开时，看到部分展示的动画，故还原数据在此进行
                helpers.restoreDataToDefault(this, ['naturalPerson', 'certificatePhotoFront', 'certificatePhotoBack']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                if (this.creating) {
                    api.admin().post(helpers.convertURL(adminURL.add_natural_person), this.naturalPerson).then(() => {
                        this.$message({type: 'success', message: '新增自然人成功'});
                        this.onClose(true);
                    });
                } else {
                    api.admin().put(helpers.convertURL(adminURL.update_natural_person, {userUUID: this.uuid}), this.naturalPerson).then(() => {
                        this.$message({type: 'success', message: '编辑自然人成功'});
                        this.onClose(true);
                    });
                }
            },
            certificatePhotoFrontUploadSuccess(imageCode) {
                this.naturalPerson.certificate_photo_front = imageCode;
            },
            certificatePhotoFrontUploadRemove() {
                this.naturalPerson.certificate_photo_front = '';
            },
            certificatePhotoBackUploadSuccess(imageCode) {
                this.naturalPerson.certificate_photo_back = imageCode;
            },
            certificatePhotoBackUploadRemove() {
                this.naturalPerson.certificate_photo_back = '';
            },
            auditPassedFunc() {
                this.$confirm('将审核自然人成功，审核完成后不能撤销', '提示', {type: 'warning'}).then(() => {
                    this.auditFunc(99);
                }).catch(() => {
                });
            },
            auditFailedFunc() {
                this.$confirm('将审核自然人状态为失败，确定吗？', '提示', {type: 'warning'}).then(() => {
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
                api.admin().post(helpers.convertURL(adminURL.natural_person_audit_status, {userUUID: this.uuid}), {
                    audit_status: auditStatus
                }).then(() => {
                    this.$message({type: 'success', message: '审核自然人完成'});
                    this.onClose(true);
                })
            },

            fetchBankCard() {
                api.admin().get(helpers.convertURL(adminURL.natural_person_bank_card_list, {userUUID: this.uuid})).then((response) => {
                    this.bankCardListData = response;
                })
            },
            bankCardInfoFunc(bankCardUUID = '') {
                this.dialogBankCardUUID = bankCardUUID;
                this.showBankCardDialog = true;
            },
            closeBankCardDialogFunc(refresh) {
                if (refresh) {
                    this.fetchBankCard();
                }
            },
            deleteBankCardFunc(bankCardUUID) {
                this.$confirm('确定删除此银行卡吗？', '提示', {type: 'warning'}).then(() => {
                    return api.admin().delete(helpers.convertURL(adminURL.delete_natural_person_bank_card, {
                        userUUID: this.uuid,
                        bankCardUUID: bankCardUUID
                    }));
                }).then(() => {
                    this.$message({type: 'success', message: '删除银行卡成功'});
                    this.fetchBankCard();
                }).catch(() => {
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
</style>