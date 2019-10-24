import VueRouter from 'vue-router';
import AppLayout from '../layouts/AppLayout';
import enterpriseURL from '../api/url/enterprise';
import withCheckVersion from './check-version';

import LoginIndexPage from '../pages/enterprise/login/Index';
import LoginLogoutPage from '../pages/enterprise/login/Logout';
import DashboardPage from '../pages/enterprise/Dashboard';

import SelfEmployIndexPage from '../pages/enterprise/self-employ/Index';
import NaturalPersonIndexPage from '../pages/enterprise/natural-person/Index';
import EnterpriseIndexPage from '../pages/enterprise/enterprise/Index';
import ContractIndexPage from '../pages/enterprise/contract/Index';
import ProjectIndexPage from '../pages/enterprise/project/Index';
import TaskIndexPage from '../pages/enterprise/task/Index';

// 配合权限管理，在meta中加2个属性
// allow 为 true 表示 无需经过权限认证
// sign 表示该节点对应的权限标志

// 配合tabs，在meta中加1个属性
// tabName 表示共用的tabs name，默认为路由的name
const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginIndexPage,
        meta: {title: '登录', menuHidden: true, allow: true},
    },
    {
        path: '/logout',
        name: 'logout',
        component: LoginLogoutPage,
        meta: {title: '退出登录', menuHidden: true, allow: true},
    },
    {
        path: '/',
        name: 'index',
        component: AppLayout,
        redirect: 'dashboard',
        meta: {title: '首页', icon: 'home'},
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
                meta: {title: '首页', menuHidden: true, allow: true},
            },
        ],
    },

    {
        path: '',
        component: AppLayout,
        meta: {title: '企业管理', icon: 'building'},
        children: [
            {
                path: '/enterprises',
                name: 'enterprises',
                component: EnterpriseIndexPage,
                meta: {title: '企业列表', sign: 'GET ' + enterpriseURL.enterprise_list},
            },
        ],
    },


    {
        path: '',
        component: AppLayout,
        meta: {title: '合约管理', icon: 'file-contract'},
        children: [
            {
                path: '/contracts',
                name: 'contracts',
                component: ContractIndexPage,
                // 注意，这里的合约列表展示的是以供应商为主体的列表，所以权限是获取供应商列表
                meta: {title: '合约列表', sign: 'GET ' + enterpriseURL.supplier_list},
            },
        ],
    },
    {
        path: '',
        component: AppLayout,
        meta: {title: '个体管理', icon: 'user'},
        children: [
            {
                path: '/self-employs',
                name: 'self-employs',
                component: SelfEmployIndexPage,
                meta: {title: '个体列表', sign: 'GET ' + enterpriseURL.enterprise_self_employ_list},
            },
            {
                path: '/natural-persons',
                name: 'natural-persons',
                component: NaturalPersonIndexPage,
                meta: {title: '自然人列表', sign: 'GET ' + enterpriseURL.enterprise_natural_person_list},
            },
        ],
    },

    {
        path: '',
        component: AppLayout,
        meta: {title: '项目管理', icon: 'project-diagram'},
        children: [
            {
                path: '/projects',
                name: 'projects',
                component: ProjectIndexPage,
                meta: {title: '项目列表', sign: 'GET ' + enterpriseURL.project_list},
            },
        ],
    },
    {
        path: '',
        component: AppLayout,
        meta: {title: '任务订单', icon: 'tasks'},
        children: [
            {
                path: '/tasks',
                name: 'tasks',
                component: TaskIndexPage,
                meta: {title: '任务订单', sign: 'GET ' + enterpriseURL.task_list},
            },
        ],
    },
];

export default withCheckVersion(new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes,
    group: 'enterprise',
}));