<template>
    <el-dialog title="个人信息修改" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="600px"
               class="ql-dialog">
        <el-tabs v-model="activeName">
            <el-tab-pane label="个人资料" name="index">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="UUID">
                        <el-input :value="enterpriseUser.user_uuid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员姓名">
                        <el-input v-model="enterpriseUser.user_name" maxlength="10" placeholder="管理员姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号">
                        <el-input :value="enterpriseUser.user_phone" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateInfo">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
                <el-form label-width="100px" auto-complete="off">
                    <el-form-item label="原密码">
                        <el-input v-model="enterpriseUser.old_password" maxlength="32" placeholder="请输入原密码"
                                  type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="enterpriseUser.new_password" maxlength="32" placeholder="请输入新密码"
                                  type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码">
                        <el-input v-model="enterpriseUser.new_password_confirmation" maxlength="32"
                                  placeholder="请再次输入新密码"
                                  type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword">修改密码</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import enterpriseURL from '../../../api/url/enterprise';

    export default {
        name: 'EnterprisePerson',
        components: {},
        data: () => ({
            elVisible: false,

            activeName: 'index',
            enterpriseUser: {},
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
                this.fetchInfo();
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['activeName', 'enterpriseUser']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            fetchInfo() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_my_info)).then(response => {
                    this.enterpriseUser = response.data;
                });
            },
            updateInfo() {
                api.enterprise().put(helpers.convertURL(enterpriseURL.update_my_info), this.enterpriseUser).then(response => {
                    this.$message({type: 'success', message: '信息更新成功'});
                    localStorage.user = JSON.stringify(response.data);
                    this.onClose()
                });
            },
            updatePassword() {
                api.enterprise().patch(helpers.convertURL(enterpriseURL.update_my_password), this.enterpriseUser).then(() => {
                    this.$message({type: 'success', message: '密码更新成功，请重新登录'});
                    setTimeout(() => {
                        this.$router.replace({name: 'login'});
                    }, 2000);
                });
            },
        },
    };
</script>
<style scoped>
</style>