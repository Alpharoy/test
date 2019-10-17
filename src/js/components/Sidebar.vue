<template>
    <el-menu class="sidebar-menu"
             @open="handleOpen"
             @close="handleClose"
             unique-opened
             :collapse="collapse">
        <sidebar-menu v-for="(route, index) in filteredRoutes" :index="index + 1 + ''" :route="route" :key="index"/>
    </el-menu>
</template>
<script>
    import SidebarMenu from './SidebarMenu';

    export default {
        name: 'Sidebar',
        components: {
            SidebarMenu,
        },

        props: {
            collapse: {
                type: Boolean,
                default: true,
            },
            routes: {
                type: Array,
                default: () => [],
            },
        },

        computed: {
            filteredRoutes() {
                // 移除被隐藏的菜单
                const filterHiddenRoutes = routes => {
                    return routes.filter(route => {
                        if (route.meta && route.meta.menuHidden) {
                            return false;
                        }

                        // 子菜单列表同样需要移除
                        const children = route.children || [];
                        if (children.length > 0) {
                            route.children = filterHiddenRoutes(children);
                        }

                        return true;
                    });
                };

                return filterHiddenRoutes(_.cloneDeep(this.routes));
            },
        },

        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
        },
    };
</script>
<style lang="scss" scoped>
    .sidebar-menu {
        border-right: none;
        &:not(.el-menu--collapse) {
            width: 200px;
        }
    }
</style>
