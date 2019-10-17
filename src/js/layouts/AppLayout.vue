<template>
    <el-container class="app-container">
        <el-aside width="auth">
            <div class="aside-header" :hidden="showAsideHeader">
                <div class="logo">

                </div>
                <!--<el-row class="user">-->
                <!--<el-col :span="10">-->
                <!--<div class="user-pic">-->
                <!--<img class="img-circle" src="https://img.kanzhun.com/images/logo/20161009/54002e390c936d35666dfb3c2c748a6b.jpg" alt="头像">-->
                <!--</div>-->
                <!--</el-col>-->
                <!--<el-col :span="14">-->
                <!--<div class="user-info"><span>管理员</span></div>-->
                <!--</el-col>-->
                <!--</el-row>-->
            </div>
            <sidebar :routes="routes" :collapse="sidebarCollapse"/>
        </el-aside>
        <el-container>
            <div class="global-loading" v-show="isLoading">
                <i class="el-icon-loading"></i>
            </div>
            <el-header height="50px">
                <sidebar-toggler :toggle="sidebarToggle" :collapse="sidebarCollapse"/>
            </el-header>
            <el-main>
                <div class="main-tab" style="padding-top: 6px">
                    <route-tabs ref="routeTabs"></route-tabs>
                </div>
                <div class="main-content">
                    <transition name="slide-fade" mode="out-in">
                        <keep-alive>
                            <router-view :key="$route.name"></router-view>
                        </keep-alive>
                    </transition>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import Sidebar from '../components/Sidebar';
    import SidebarToggler from '../components/SidebarToggler';
    import RouteTabs from '../components/RouteTabs';

    export default {
        name: 'AppLayout',
        provide: function () {
            return {
                getRouteTab: this.getRouteTab,
            };
        },
        data: () => ({
            routes: [],
            showAsideHeader: false,
        }),
        components: {
            Sidebar,
            SidebarToggler,
            RouteTabs,
        },
        mounted() {
            this.$store.dispatch('routeInit', this.$router.options.group).then(() => {
                this.routes = this.$store.state.router.routes;
            });
        },
        computed: {
            sidebarCollapse() {
                this.showAsideHeader = this.$store.state.app.sidebarCollapse;
                return this.$store.state.app.sidebarCollapse;
            },
            isLoading() {
                return this.$store.state.app.loadingCount > 0;
            },
        },
        methods: {
            sidebarToggle() {
                this.$store.dispatch('sidebarToggle');
            },
            getRouteTab() {
                return this.$refs.routeTabs;
            },
        },
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .el-header {
        line-height: 50px;
    }

    .el-aside::-webkit-scrollbar {
        display: none;
    }

    .aside-header {
        width: 200px;
    }

    .logo {
        width: 100%;
        height: 50px;
        background: #233144;
        text-align: center;
        img {
            margin-top: 5px;
        }
    }

    .user {
        margin-top: 10px;
    }

    .user-pic {

    }

    .user-info {
        line-height: 50px;
    }

    .img-circle {
        border-radius: 50%;
        width: 50px;
        margin-left: 20%;
    }

    .el-menu {
        height: 100%;
    }

    .el-menu--collapse .el-menu--vertical {
        display: none;
    }

    .el-container {
        position: relative;
    }

    .global-loading {
        position: absolute;
        top: 60px;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(255, 255, 255, .7);
    }

    .global-loading .el-icon-loading {
        position: absolute;
        font-size: 50px;
        top: 50%;
        left: 50%;
        margin-left: -25px;
        margin-top: -25px;
    }
</style>
