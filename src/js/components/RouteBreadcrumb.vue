<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            <fa-icon v-if="breadcrumb.icon" :icon="breadcrumb.icon"/>
            <span>{{breadcrumb.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
    export default {
        name: 'RouteBreadcrumb',
        props: {
            route: {
                type: Object,
                default: null,
            },
        },
        computed: {
            breadcrumbs() {
                // 固定首页
                const breadcrumbs = [{
                    name: 'dashboard',
                    title: 'DLMS',
                    //icon: 'home',
                }];

                this.route.matched.forEach(route => {
                    const meta = route.meta || {};
                    // 重定向的不写入
                    if (route.redirect) {
                        return;
                    }
                    // 没有标题不写入面包屑
                    if (!(meta.title && meta.title.length > 0)) {
                        return;
                    }

                    // 写入请求路由
                    const {path, name} = route, breadcrumb = {title: meta.title};
                    if (name) {
                        breadcrumb.name = name;
                    } else if (path) {
                        breadcrumb.path = path;
                    } else {
                        return;
                    }

                    // 写入路由参数
                    breadcrumb.params = this.route.params;
                    breadcrumbs.push(breadcrumb);
                });

                return breadcrumbs;
            },
        },
    };
</script>
<style lang="scss">
    .el-breadcrumb {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        span {
            font-weight: 400;
        }
    }
</style>
