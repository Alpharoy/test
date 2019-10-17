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

    // 供应商管理
    supplier_list: 'suppliers',
    add_supplier: 'suppliers',
    get_supplier: 'suppliers/{supplierUUID}',
    update_supplier: 'suppliers/{supplierUUID}',

    // 供应商管理员管理
    supplier_user_list: 'supplier-users',
    add_supplier_user: 'supplier-users',
    get_supplier_user: 'supplier-users/{userUUID}',
    update_supplier_user: 'supplier-users/{userUUID}',
    supplier_user_log_list: 'supplier-users/{userUUID}/login-logs',
    reset_supplier_user_password: 'supplier-users/{userUUID}/reset-password',
    supplier_user_lock: 'supplier-users/{userUUID}/lock',
    supplier_user_unlock: 'supplier-users/{userUUID}/unlock',
    get_supplier_user_role: 'supplier-users/{userUUID}/roles',

    // 供应商业务类型
    supplier_subject_list: 'supplier-subjects',
    add_supplier_subject: 'supplier-subjects',
    update_supplier_subject: 'supplier-subjects/{supplierSubjectUUID}',

    // 合约列表
    contract_list: 'contracts',
    get_contract: 'contracts/{contractUUID}',
    contract_audit_status: 'contracts/{contractUUID}/audit-status',

    // 项目列表
    project_list: 'projects',
    get_project: 'projects/{projectUUID}',
    update_project: 'projects/{projectUUID}',
    project_audit_status: 'projects/{projectUUID}/audit-status',

    // 个体工商管理
    self_employ_list: 'self-employs',
    get_self_employ: 'self-employs/{selfEmployUUID}',

    // 自然人管理
    natural_person_list: 'natural-persons',
    get_natural_person: 'natural-persons/{userUUID}',
};
