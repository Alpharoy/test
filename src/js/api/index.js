import axios from 'axios';
import store from '../store';
import adminRouter from '../router/admin';
import supplierRouter from '../router/supplier';
import enterpriseRouter from '../router/enterprise';
import {Message} from 'element-ui';

import ResponsePage from './responses/page';
import ResponseRateLimit from './responses/rate-limit';
import helpers from '../extends/helpers';
import config from '../config';

const api = axios.create({
    baseURL: '',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 30000,
    params: {},
    data: {},
    useLoading: true,
});

/**
 * 重载get head delete方法
 * 添加data作为第二个参数
 * 为了与post put patch参数相同
 */
const addDataParam = requestMethod => {
    return (url, data = {}, config = {}) => {
        const params = config.params || {};
        _.merge(params, data);
        config.params = params;

        return requestMethod(url, config);
    };
};

api.get = addDataParam(api.get);
api.head = addDataParam(api.head);
api.delete = addDataParam(api.delete);

/**
 * 添加请求头部
 */
api.interceptors.request.use(config => {
    config.headers['X-Api-Token'] = store.state.app.apiToken;
    if (config.useLoading) {
        // 请求数量 +1
        store.dispatch('setLoadingCount', 1);
    }
    return config;
}, error => Promise.reject(error));

/**
 * 统一响应处理
 */
api.interceptors.response.use(response => {
    const config = response.config;
    if (config.useLoading) {
        // 请求数量 -1
        store.dispatch('setLoadingCount', -1);
    }
    let router;
    if (config.group === 'admin') {
        router = adminRouter;
    } else if (config.group === 'supplier') {
        router = supplierRouter;
    } else if (config.group === 'enterprise') {
        router = enterpriseRouter;
    }

    const headers = response.headers;

    // 注入接口频率限制信息
    response.rateLimit = new ResponseRateLimit({
        limit: headers['x-ratelimit-limit'],
        remaining: headers['x-ratelimit-remaining'],
        retryAfter: headers['retry-after'],
        resetAt: headers['x-ratelimit-reset'],
    });

    // 注入分页信息
    response.page = new ResponsePage({
        currentPage: headers['x-page-currentpage'],
        perPage: headers['x-page-perpage'],
        totalCount: headers['x-page-totalcount'],
    });

    if (headers['x-page-totalcount'] !== undefined) {
        // 当前请求的分页数大于总页数时，自动重定向到最后一页
        let currentPage = parseInt(headers['x-page-currentpage']);
        let maxPage = Math.ceil(headers['x-page-totalcount'] / headers['x-page-perpage']);
        maxPage = maxPage ? maxPage : 1;

        if (currentPage > maxPage) {
            let currentRouter = router.history.current;
            let query = _.cloneDeep(currentRouter.query);
            query.page = maxPage;
            if (router) {
                router.replace({name: currentRouter.name, params: currentRouter.params, query: query});
            }
            return;
        }
    }

    return response;
}, error => {
    const response = error.response || {};
    const config = response.config || {};
    if (config.useLoading) {
        // 请求数量 -1
        store.dispatch('setLoadingCount', -1);
    }
    let router;
    if (config.group === 'admin') {
        router = adminRouter;
    } else if (config.group === 'supplier') {
        router = supplierRouter;
    } else if (config.group === 'enterprise') {
        router = enterpriseRouter;
    }

    // 统一错误处理
    const code = response.status;
    if (code === 401) {
        Message.error({
            message: '登录已失效，请重新登录',
            duration: 5000,
        });
        if (router) {
            router.replace({name: 'login'});
        }
        return Promise.reject(error);
    }
    helpers.errorHandler(error.response);
    return Promise.reject(error);
});

api.admin = () => {
    api.defaults.baseURL = config.API_OJMS_BASE_URI + '/admin-api/';
    api.defaults.group = 'admin';
    return api;
};
api.supplier = () => {
    api.defaults.baseURL = config.API_OJMS_BASE_URI + '/supplier-api/';
    api.defaults.group = 'supplier';
    return api;
};
api.enterprise = () => {
    api.defaults.baseURL = config.API_OJMS_BASE_URI + '/enterprise-api/';
    api.defaults.group = 'enterprise';
    return api;
};
api.common = () => {
    api.defaults.baseURL = config.API_OJMS_BASE_URI + '/common-api/';
    api.defaults.group = 'common';
    return api;
};

export default api;