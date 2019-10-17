<template>
    <router-link v-bind="$attrs">
        <span @click="recordReferer">
            <slot></slot>
        </span>
    </router-link>
</template>
<script>
    export default {
        name: 'UrRouterLink',
        data: () => ({}),
        props: {},
        computed: {},
        methods: {
            recordReferer() {
                // 记录每个页面的来源地址，用于“返回”的链接
                let referer = localStorage.referer ? JSON.parse(localStorage.referer) : {};
                referer[this.$attrs.to.name] = this.$route.fullPath;
                localStorage.referer = JSON.stringify(referer);
            },
        },
    };
</script>
<style scoped>
</style>