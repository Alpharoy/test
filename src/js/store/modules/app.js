import cookie from 'js-cookie';

const sidebarCollapsed = cookie.get('sidebar_collapse');
const token = cookie.get('token');

export default {
    state: {
        // 请求token，从cookie中获取，不然页面手动刷新的时候会获取不到
        apiToken: token ? token : null,

        // 将从cookies获取的字符串'0'、'1'转成bool类型，默认菜单折叠起来
        sidebarCollapse: sidebarCollapsed === undefined ? true : !!+sidebarCollapsed,

        // 当前请求数量
        loadingCount: 0,
    },

    mutations: {
        setApiToken(state, newApiToken) {
            state.apiToken = newApiToken;
            // 保存到cookies
            cookie.set('token', newApiToken || '', {expires: 365 * 10});
        },
        sidebarToggle(state) {
            state.sidebarCollapse = !state.sidebarCollapse;
            // 保存到cookies
            cookie.set('sidebar_collapse', +state.sidebarCollapse, {expires: 365 * 10});
        },
        setLoadingCount(state, increaseCount) {
            state.loadingCount = Math.max(state.loadingCount + increaseCount, 0);
        },
    },

    actions: {
        setApiToken({commit}, newApiToken) {
            commit('setApiToken', newApiToken);
        },
        sidebarToggle({commit}) {
            commit('sidebarToggle');
        },
        setLoadingCount({commit}, increaseCount) {
            commit('setLoadingCount', increaseCount);
        },
    },
};