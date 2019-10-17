<template>
    <el-button type="primary" @click="navigateBack">返回</el-button>
</template>
<script>
    export default {
        name: 'QlBack',
        data: () => ({}),
        props: {},
        computed: {},
        methods: {
            navigateBack() {
                let referer = localStorage.referer ? JSON.parse(localStorage.referer) : {};
                if (referer[this.$route.name]) {
                    this.$router.push(referer[this.$route.name]);
                    return;
                }
                this.$router.back();
            },
        },
    };
</script>
<style scoped>
</style>