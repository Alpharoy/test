<template>
    <el-dialog title="" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog" append-to-body>
        <el-form label-width="120px" auto-complete="off">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>更新信息</span>
                </div>
                <el-form-item label="UUID">
                    <el-input :value="selfEmployUser.user_uuid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="管理员姓名">
                    <el-input v-model="selfEmployUser.user_name" maxlength="16" placeholder="管理员姓名"></el-input>
                </el-form-item>
                <el-form-item label="登录账号">
                    <el-input :value="selfEmployUser.user_phone" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitUpdate">更新</el-button>
                </el-form-item>
            </el-card>
        </el-form>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import adminURL from '../../../api/url/admin';

    export default {
        name: 'UserInfoDialog',
        components: {},
        data: () => ({
            elVisible: false,
            selfEmployUser: {},
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            selfEmployUuid: {
                type: String,
                default: '',
            },
            uuid: {
                type: String,
                default: '',
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
                helpers.restoreDataToDefault(this, ['selfEmployUser']);
                api.admin().get(helpers.convertURL(adminURL.get_self_employ_user, {
                    selfEmployUUID: this.selfEmployUuid,
                    userUUID: this.uuid
                })).then(response => this.selfEmployUser = response.data);
            },
            onClose(refresh = false) {
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            submitUpdate() {
                api.admin().put(helpers.convertURL(adminURL.update_self_employ_user, {
                    userUUID: this.uuid,
                    selfEmployUUID: this.selfEmployUuid
                }), this.selfEmployUser).then(response => {
                    this.$message({type: 'success', message: '管理员信息更新成功'});
                    this.onClose(true);
                });
            },

        },
    };
</script>
<style scoped>
</style>