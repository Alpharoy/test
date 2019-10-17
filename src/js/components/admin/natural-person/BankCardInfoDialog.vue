<template>
    <el-dialog title="银行卡信息" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog" append-to-body>
        <el-form label-width="100px" auto-complete="off">
            <el-form-item label="持卡人">
                <el-input :value="bankCard.card_holder" disabled></el-input>
            </el-form-item>
            <el-form-item label="银行">
                <el-select v-model="bankCard.bank_identity" placeholder="请选择" style="width: 100%;"
                           v-if="canUpdateCardInfo">
                    <el-option v-for="bankIdentity in bankIdentities" :label="bankIdentity.name"
                               :value="bankIdentity.code" :key="bankIdentity.code"></el-option>
                </el-select>
                <el-input :value="bankCard.bank_name" disabled v-else></el-input>
            </el-form-item>
            <el-form-item label="银行卡号">
                <el-input v-model="bankCard.card_number" :disabled="!canUpdateCardInfo" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="预留手机号">
                <el-input v-model="bankCard.card_holder_phone" :disabled="!canUpdateCardInfo" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-checkbox v-model="bankCard.is_default">是否默认</el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="submitFunc">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import adminURL from '../../../api/url/admin';

    export default {
        name: 'BankCardInfoDialog',
        components: {},
        data: () => ({
            elVisible: false,

            bankIdentities: helpers.cons('common.bank_identity'),

            bankCard: {
                card_holder: '',
                card_holder_phone: '',
                bank_identity: '',
                is_verified: false,
                is_default: false,
            },
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            userUuid: {
                type: String,
                default: '',
            },
            bankCardUuid: {
                type: String,
                default: '',
            },
            // 自然人信息
            naturalPerson: {
                type: Object,
                default: () => {
                    return {};
                }
            },
        },
        computed: {
            creating() {
                return !this.bankCardUuid;
            },
            // 银行卡通过验证，则不能更改银行卡信息
            canUpdateCardInfo() {
                return !this.bankCard.is_verified;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                if (!this.creating) {
                    api.admin().get(helpers.convertURL(adminURL.get_natural_person_bank_card, {
                        userUUID: this.userUuid,
                        bankCardUUID: this.bankCardUuid
                    })).then((response) => {
                        this.bankCard = response.data;
                    });
                } else {
                    this.bankCard.card_holder = this.naturalPerson.user_name;
                    this.bankCard.card_holder_phone = this.naturalPerson.user_phone;
                }
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['bankCard']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitFunc() {
                if (!this.creating) {
                    api.admin().put(helpers.convertURL(adminURL.update_natural_person_bank_card, {
                        userUUID: this.userUuid,
                        bankCardUUID: this.bankCardUuid
                    }), this.bankCard).then((response) => {
                        this.$message({type: 'success', message: '更新银行卡信息成功'});
                        this.onClose(true);
                    });
                } else {
                    api.admin().post(helpers.convertURL(adminURL.add_natural_person_bank_card, {
                        userUUID: this.userUuid
                    }), this.bankCard).then((response) => {
                        this.$message({type: 'success', message: '新增银行卡信息成功'});
                        this.onClose(true);
                    });
                }
            },
        },
    };
</script>
<style scoped>
</style>