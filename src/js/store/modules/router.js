import enterpriseRoutes from '../../router/enterprise';
import supplierRoutes from '../../router/supplier';
import adminRoutes from '../../router/admin';

import api from '../../api';

import enterpriseURL from '../../api/url/enterprise';
import supplierURL from '../../api/url/supplier';
import adminURL from '../../api/url/admin';

/**
 * 菜单权限判断
 * @param responseRoutes
 * @param groupRoutes
 * @returns {*}
 */
const filterFunc = (responseRoutes, groupRoutes) => {
    let responseRoutesAssoc = {};
    groupRoutes = _.cloneDeep(groupRoutes);
    _.forEach(responseRoutes, (item) => {
        responseRoutesAssoc[item.sign] = item;
    });
    // 过滤函数
    const filter = (route) => {
        const meta = route.meta;

        // 菜单本来隐藏
        if (meta.menuHidden === true) {
            return false;
        }

        // 菜单本来允许
        if (meta.allow === true) {
            return false;
        }

        const sign = route.meta.sign;
        if (sign === undefined) {
            meta.menuHidden = true;
            return false;
        }
        const [method, url] = sign.split(' ');
        if (method === undefined || url === undefined) {
            meta.menuHidden = true;
            return false;
        }
        const allName = '__ALL__';
        const verifySignNodes = [allName + ' ' + allName, 'GET ' + allName, method + ' ' + url];

        let allow = false;
        _.forEach(verifySignNodes, (node) => {
            if (!_.isEmpty(responseRoutesAssoc[node])) {
                allow = true;
                return false;
            }
        });
        if (!allow) {
            meta.menuHidden = true;
            return false;
        }

        return true;
    };

    // 过滤权限
    _.forEach(groupRoutes, (item) => {
        if (_.isEmpty(item.children)) {
            filter(item);
            return true;
        }
        _.forEach(item.children, (childItem) => {
            filter(childItem);
        });
    });

    // 折叠没有权限的父菜单
    _.forEach(groupRoutes, (item) => {
        if (item.meta.menuHidden === true) {
            return true;
        }
        if (_.isEmpty(item.children)) {
            return true;
        }
        if (item.redirect) {
            return true;
        }
        item.meta.menuHidden = true;
        _.forEach(item.children, (childItem) => {
            if (childItem.meta.menuHidden !== true) {
                item.meta.menuHidden = false;
                return false;
            }
        });
    });
    return groupRoutes;
};

export default {
    state: {
        routes: [],
    },

    mutations: {
        routeInit(state, filterRoutes) {
            state.routes = filterRoutes;
        },
    },

    actions: {
        routeInit({commit}, group) {
            return new Promise((resolve, reject) => {
                let tmpApi, groupRoutes, url;

                const requestRoute = () => {
                    //TODO: 暂时去掉权限管理
                    commit('routeInit', groupRoutes);
                    resolve();
                    return;
                    tmpApi.get(url).then((response) => {
                        commit('routeInit', filterFunc(response.data, groupRoutes));
                        resolve();
                    }).catch((err) => {
                        reject(new Error('获取菜单列表失败'));
                    });
                };

                if (group === 'enterprise') {
                    tmpApi = api.enterprise();
                    groupRoutes = enterpriseRoutes.options.routes;
                    url = enterpriseURL.my_nodes;
                    requestRoute();
                } else if (group === 'supplier') {
                    tmpApi = api.supplier();
                    groupRoutes = supplierRoutes.options.routes;
                    url = supplierURL.my_nodes;
                    requestRoute();
                } else if (group === 'admin') {
                    tmpApi = api.admin();
                    groupRoutes = adminRoutes.options.routes;
                    url = adminURL.my_nodes;
                    requestRoute();
                } else {
                    reject(new Error('未知分组菜单'));
                    return false;
                }
            });
        },
    },

    computed: {},

    getters: {},
};