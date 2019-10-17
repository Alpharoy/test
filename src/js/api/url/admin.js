export default {
    // 登录
    login: 'login-tokens',
    logout: 'login-tokens',

    // 当前管理员
    get_my_info: 'me',
    update_my_info: 'me',
    my_nodes: 'me/nodes',
    update_my_password: 'me/password',

    // 权限配置
    role_list: 'roles',
    add_role: 'roles',
    get_role: 'roles/{id}',
    update_role: 'roles/{id}',
    delete_role: 'roles/{id}',
    menu_list: 'menus',
    add_menu: 'menus',
    get_menu: 'menus/{id}',
    update_menu: 'menus/{id}',
    delete_menu: 'menus/{id}',
    node_list: 'nodes',

    // 管理公司
    admin_list: 'admins',
    get_admin: 'admins/{adminUUID}',
    update_admin: 'admins/{adminUUID}',

    // 管理公司管理员管理
    admin_user_list: 'admin-users',
    add_admin_user: 'admin-users',
    get_admin_user: 'admin-users/{userUUID}',
    update_admin_user: 'admin-users/{userUUID}',
    reset_admin_user_password: 'admin-users/{userUUID}/reset-password',
    admin_user_log_list: 'admin-users/{userUUID}/login-logs',
    admin_user_lock: 'admin-users/{userUUID}/lock',
    admin_user_unlock: 'admin-users/{userUUID}/unlock',
    get_admin_user_role: 'admin-users/{userUUID}/roles',

    // 企业管理
    enterprise_list: 'enterprises',
    add_enterprise: 'enterprises',
    get_enterprise: 'enterprises/{enterpriseUUID}',
    update_enterprise: 'enterprises/{enterpriseUUID}',
    enterprise_audit_status: 'enterprises/{enterpriseUUID}/audit-status',
    // 企业管理员管理
    enterprise_user_list: 'enterprises/{enterpriseUUID}/enterprise-users',
    add_enterprise_user: 'enterprises/{enterpriseUUID}/enterprise-users',
    get_enterprise_user: 'enterprises/{enterpriseUUID}/enterprise-users/{userUUID}',
    update_enterprise_user: 'enterprises/{enterpriseUUID}/enterprise-users/{userUUID}',
    enterprise_user_log_list: 'enterprises/{enterpriseUUID}/enterprise-users/{userUUID}/login-logs',

    //供应商管理
    supplier_list: 'suppliers',
    add_supplier: 'suppliers',
    get_supplier: 'suppliers/{supplierUUID}',
    update_supplier: 'suppliers/{supplierUUID}',
    supplier_audit_status: 'suppliers/{supplierUUID}/audit-status',

    //供应商管理员管理
    supplier_user_list: 'suppliers/{supplierUUID}/supplier-users',
    add_supplier_user: 'suppliers/{supplierUUID}/supplier-users',
    get_supplier_user: 'suppliers/{supplierUUID}/supplier-users/{userUUID}',
    update_supplier_user: 'suppliers/{supplierUUID}/supplier-users/{userUUID}',
    supplier_user_log_list: 'suppliers/{supplierUUID}/supplier-users/{userUUID}/login-logs',

    // 合约列表
    contract_list: 'contracts',
    get_contract: 'contracts/{contractUUID}',

    // 项目列表
    project_list: 'projects',
    get_project: 'projects/{projectUUID}',

    // 个体工商管理
    self_employ_list: 'self-employs',
    add_self_employ: 'self-employs',
    get_self_employ: 'self-employs/{selfEmployUUID}',
    update_self_employ: 'self-employs/{selfEmployUUID}',
    self_employ_audit_status: 'self-employs/{selfEmployUUID}/audit-status',
    // 个体工商管理员管理
    self_employ_user_list: 'self-employs/{selfEmployUUID}/self-employ-users',
    get_self_employ_user: 'self-employs/{selfEmployUUID}/self-employ-users/{userUUID}',
    update_self_employ_user: 'self-employs/{selfEmployUUID}/self-employ-users/{userUUID}',


    // 自然人管理
    natural_person_list: 'natural-persons',
    get_natural_person: 'natural-persons/{userUUID}',
    add_natural_person: 'natural-persons',
    update_natural_person: 'natural-persons/{userUUID}',
    natural_person_audit_status: 'natural-persons/{userUUID}/audit-status',
    //自然人银行卡管理
    natural_person_bank_card_list: 'natural-persons/{userUUID}/bank-cards',
    add_natural_person_bank_card: 'natural-persons/{userUUID}/bank-cards',
    get_natural_person_bank_card: 'natural-persons/{userUUID}/bank-cards/{bankCardUUID}',
    update_natural_person_bank_card: 'natural-persons/{userUUID}/bank-cards/{bankCardUUID}',
    delete_natural_person_bank_card: 'natural-persons/{userUUID}/bank-cards/{bankCardUUID}',
};