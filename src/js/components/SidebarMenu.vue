<template>
    <el-submenu v-if="menu.route.children.length" :index="index">
        <template slot="title">
            <fa-icon v-if="menu.icon" :icon="menu.icon" style="width: 30px;"/>
            <span slot="title">{{menu.title}}</span>
        </template>
        <sidebar-menu v-for="(route, subIndex) in menu.route.children" :route="route" :key="subIndex"
                      :index="index + '-' + (subIndex + 1)"/>
    </el-submenu>
    <router-link v-else :to="menu.route">
        <el-menu-item :index="index">
            <fa-icon v-if="menu.icon" :icon="menu.icon" style="width: 30px;"/>
            <span v-else style="margin-left: 20px;"></span>
            <span slot="title">{{menu.title}}</span>
        </el-menu-item>
    </router-link>
</template>
<script>
    export default {
        name: 'SidebarMenu',

        props: {
            route: {
                type: Object,
                required: true,
            },
            index: {
                type: String,
                default: null,
            },
        },

        computed: {
            menu() {
                const route = this.route;
                const meta = route.meta || {};

                return {
                    title: meta.title,
                    icon: meta.icon,
                    route: {
                        name: route.name,
                        params: route.params,
                        query: route.query,
                        children: route.children || [],
                    },
                };
            },
        },
    };
</script>
<style lang="scss" scoped>
    .el-menu {
        a {
            text-decoration: none;
        }
    }
</style>