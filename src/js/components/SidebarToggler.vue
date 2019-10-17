<template>
    <el-row>
        <el-col :span="18">
            <fa-icon icon="bars" @click="toggle" :class="{'collapsed':collapse}"/>
            <route-breadcrumb :route="$route"/>
        </el-col>
        <el-col :span="6" class="personal">
            <el-dropdown placement="bottom">
                <span class="el-dropdown-link">{{ userName }}</span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <el-button type="text" @click="showPersonDialog = true">个人信息</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button type="text" @click="showVersionDialog = true">关于我们</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button type="text" @click="onLogout">退出登录</el-button>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>

        <template v-if="group === 'admin'">
            <admin-version :visible.sync="showVersionDialog"></admin-version>
            <admin-person :visible.sync="showPersonDialog"></admin-person>
        </template>
        <template v-if="group === 'enterprise'">
            <enterprise-version :visible.sync="showVersionDialog"></enterprise-version>
            <enterprise-person :visible.sync="showPersonDialog"></enterprise-person>
        </template>
        <template v-if="group === 'supplier'">
            <supplier-version :visible.sync="showVersionDialog"></supplier-version>
            <supplier-person :visible.sync="showPersonDialog"></supplier-person>
        </template>
    </el-row>
</template>
<script>
    import RouteBreadcrumb from '../components/RouteBreadcrumb';
    import AdminVersion from './admin/person/VersionDialog';
    import EnterpriseVersion from './enterprise/person/VersionDialog';
    import SupplierVersion from './supplier/person/VersionDialog';
    import AdminPerson from './admin/person/PersonDialog';
    import EnterprisePerson from './enterprise/person/PersonDialog';
    import SupplierPerson from './supplier/person/PersonDialog';


    export default {
        name: 'SidebarToggler',
        data: () => ({
            showPersonDialog: false,
            showVersionDialog: false,
        }),
        components: {
            SupplierPerson,
            EnterprisePerson,
            AdminPerson,
            SupplierVersion,
            EnterpriseVersion,
            AdminVersion,
            RouteBreadcrumb,
        },
        computed: {
            group: function () {
                return this.$router.options.group;
            },
            userName: function () {
                let currentUser = localStorage.user ? JSON.parse(localStorage.user) : {};
                return currentUser.user_name ? currentUser.user_name : '个人中心';
            },
        },
        created() {

        },
        props: {
            collapse: {
                type: Boolean,
                default: false,
            },
            toggle: {
                type: Function,
                default: () => {
                },
            },
        },
        methods: {
            onLogout() {
                this.$router.replace({name: 'logout'});
            },
        },
    };
</script>
<style lang="scss" scoped>
    .personal {
        text-align: right;
    }

    .personal .el-dropdown {
        cursor: pointer;
        margin-right: 30px;
    }

    .personal .el-dropdown .el-dropdown-link {
        display: inline-block;
    }

    .el-dropdown-menu__item a {
        text-decoration: none;
        display: block;
    }
</style>
