import VueRouter from 'vue-router';
import AppLayout from '../layouts/AppLayout';
import supplierURL from '../api/url/supplier';
import withCheckVersion from './check-version';

import LoginIndexPage from '../pages/supplier/login/Index';
import LoginLogoutPage from '../pages/supplier/login/Logout';
import DashboardPage from '../pages/supplier/Dashboard';

import SupplierIndexPage from '../pages/supplier/supplier/Index';
import SupplierSubjectIndexPage from '../pages/supplier/supplier/supplier-subject/Index';
import SelfEmployIndexPage from '../pages/supplier/self-employ/Index';
import NaturalPersonIndexPage from '../pages/supplier/natural-person/Index';
import ContractIndexPage from '../pages/supplier/contract/Index';
import ProjectIndexPage from '../pages/supplier/project/Index';
import TaskIndexPage from '../pages/supplier/task/Index';


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
        meta: {title: '供应商管理', icon: 'synagogue'},
        children: [
            {
                path: '/suppliers',
                name: 'suppliers',
                component: SupplierIndexPage,
                meta: {title: '供应商列表', sign: 'GET ' + supplierURL.supplier_list},
            },
            {
                path: '/supplier-subjects',
                name: 'supplier-subjects',
                component: SupplierSubjectIndexPage,
                meta: {title: '业务类型', sign: 'GET ' + supplierURL.supplier_subject_list},
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
                meta: {title: '合约列表', sign: 'GET ' + supplierURL.contract_list},
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
                meta: {title: '个体列表', sign: 'GET ' + supplierURL.supplier_self_employ_list},
            },
            {
                path: '/natural-persons',
                name: 'natural-persons',
                component: NaturalPersonIndexPage,
                meta: {title: '自然人列表', sign: 'GET ' + supplierURL.supplier_natural_person_list},
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
                meta: {title: '项目列表', sign: 'GET ' + supplierURL.project_list},
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
                meta: {title: '任务订单', sign: 'GET ' + supplierURL.task_list},
            },
        ],
    },
];

export default withCheckVersion(new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes,
    group: 'supplier',
}));