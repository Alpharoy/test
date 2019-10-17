export default {
    // 登录
    login: 'login-tokens',
    logout: 'login-tokens',
    register: 'registers',
    register_send_sms_code: 'registers/send-sms',
    register_verify_sms_code: 'registers/verify-sms-code',

    // 当前管理员
    get_my_info: 'me',
    update_my_info: 'me',
    my_nodes: 'me/nodes',
    update_my_password: 'me/password',

    // 权限配置
    role_list: 'roles',

    // 企业管理
    enterprise_list: 'enterprises',
    add_enterprise: 'enterprises',
    get_enterprise: 'enterprises/{enterpriseUUID}',
    update_enterprise: 'enterprises/{enterpriseUUID}',

    // 企业管理员管理
    enterprise_user_list: 'enterprise-users',
    add_enterprise_user: 'enterprise-users',
    get_enterprise_user: 'enterprise-users/{userUUID}',
    update_enterprise_user: 'enterprise-users/{userUUID}',
    enterprise_user_log_list: 'enterprise-users/{userUUID}/login-logs',
    reset_enterprise_user_password: 'enterprise-users/{userUUID}/reset-password',
    enterprise_user_lock: 'enterprise-users/{userUUID}/lock',
    enterprise_user_unlock: 'enterprise-users/{userUUID}/unlock',
    get_enterprise_user_role: 'enterprise-users/{userUUID}/roles',

    // 供应商
    supplier_list: 'suppliers',
    supplier_subject_list: 'supplier-subjects',

    // 合约列表
    contract_list: 'contracts',
    get_contract: 'contracts/{contractUUID}',
    add_contract: 'contracts',
    update_contract: 'contracts/{contractUUID}',
    delete_contract: 'contracts/{contractUUID}',

    // 项目列表
    project_list: 'projects',
    get_project: 'projects/{projectUUID}',
    add_project: 'projects',
    update_project: 'projects/{projectUUID}',
    delete_project: 'projects/{projectUUID}',

    // 个体工商管理
    self_employ_list: 'self-employs',
    get_self_employ: 'self-employs/{selfEmployUUID}',

    // 自然人管理
    natural_person_list: 'natural-persons',
    get_natural_person: 'natural-persons/{userUUID}',
};
