import VueRouter from 'vue-router';
import AppLayout from '../layouts/AppLayout';
import adminURL from '../api/url/admin';
import withCheckVersion from './check-version';

import LoginIndexPage from '../pages/admin/login/Index';
import LoginLogoutPage from '../pages/admin/login/Logout';
import DashboardPage from '../pages/admin/Dashboard';

import PermissionRoleIndexPage from '../pages/admin/permission/RoleIndex';
import PermissionMenuIndexPage from '../pages/admin/permission/MenuIndex';

import AdminIndexPage from '../pages/admin/admin/Index';
import SelfEmployIndexPage from '../pages/admin/self-employ/Index';
import NaturalPersonIndexPage from '../pages/admin/natural-person/Index';
import EnterpriseIndexPage from '../pages/admin/enterprise/Index';
import SupplierIndexPage from '../pages/admin/supplier/Index';
import ContractIndexPage from '../pages/admin/contract/Index';
import ProjectIndexPage from '../pages/admin/project/Index';
import TaskIndexPage from '../pages/admin/task/Index';


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
        path: '/admins',
        component: AppLayout,
        meta: {title: '公司管理', icon: 'archway'},
        children: [
            {
                path: '',
                name: 'admins',
                component: AdminIndexPage,
                meta: {title: '公司列表', sign: 'GET ' + adminURL.admin_list},
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
                meta: {title: '企业列表', sign: 'GET ' + adminURL.enterprise_list},
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
                meta: {title: '供应商列表', sign: 'GET ' + adminURL.supplier_list},
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
                meta: {title: '合约列表', sign: 'GET ' + adminURL.contract_list},
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
                meta: {title: '项目列表', sign: 'GET ' + adminURL.project_list},
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
                meta: {title: '个体列表', sign: 'GET ' + adminURL.self_employ_list},
            },
            {
                path: '/natural-persons',
                name: 'natural-persons',
                component: NaturalPersonIndexPage,
                meta: {title: '自然人列表', sign: 'GET ' + adminURL.natural_person_list},
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
                meta: {title: '任务订单', sign: 'GET ' + adminURL.task_list},
            },
        ],
    },

    {
        path: '',
        component: AppLayout,
        meta: {title: '权限管理', icon: 'wrench'},
        children: [
            {
                path: '/admin-roles',
                name: 'admin-roles',
                component: PermissionRoleIndexPage,
                meta: {title: '管理角色', tabName: 'roles', sign: 'GET ' + adminURL.role_list},
            },
            {
                path: '/enterprise-roles',
                name: 'enterprise-roles',
                component: PermissionRoleIndexPage,
                meta: {title: '企业角色', tabName: 'roles', sign: 'GET ' + adminURL.role_list},
            },
            {
                path: '/supplier-roles',
                name: 'supplier-roles',
                component: PermissionRoleIndexPage,
                meta: {title: '供应商角色', tabName: 'roles', sign: 'GET ' + adminURL.role_list},
            },
            {
                path: '/admin-menus',
                name: 'admin-menus',
                component: PermissionMenuIndexPage,
                meta: {title: '管理菜单', tabName: 'roles', menuHidden: true},
            },
            {
                path: '/enterprise-menus',
                name: 'enterprise-menus',
                component: PermissionMenuIndexPage,
                meta: {title: '企业菜单', tabName: 'roles', menuHidden: true},
            },
            {
                path: '/supplier-menus',
                name: 'supplier-menus',
                component: PermissionMenuIndexPage,
                meta: {title: '供应商菜单', tabName: 'roles', menuHidden: true},
            },
        ],
    },
];

export default withCheckVersion(new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes,
    group: 'admin',
}));