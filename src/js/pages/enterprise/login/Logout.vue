<template>
</template>
<script>
    import api from '../../../api';
    import enterpriseURL from '../../../api/url/enterprise';
    import helpers from '../../../extends/helpers';

    export default {
        name: 'Logout',
        created() {
            this.logout();
        },
        methods: {
            logout() {
                api.enterprise().delete(helpers.convertURL(enterpriseURL.logout)).finally(() => {
                    this.$store.dispatch('setApiToken', '');

                    // 清除页面信息
                    localStorage.removeItem('referer');
                    //this.$router.replace({name: 'login'});
                    // 改为跳转机制，而不是单页面机制
                    window.location.href = '/login';
                });
            },
        },
    };
</script>
<style scoped>
</style>
