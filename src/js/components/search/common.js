import helpers from '../../extends/helpers';

export default {
    keyword: {label: '关键字', type: 'text'},
    user_phone: {label: '登录手机号码', type: 'text'},
    user_name: {label: '用户名', type: 'text'},
    id_card_number: {label: '身份证号', type: 'text'},

    receive_phone: {label: '接收号码', type: 'text'},
    bank_name: {label: '银行名称', type: 'text'},
    company_name: {label: '公司名称', type: 'text'},
    pay_name: {label: '对象名称', type: 'text'},
    customer_name: {label: '客户名称', type: 'text'},

    industry_type_code: {
        label: '行业类型',
        type: 'select',
        attr: {options: helpers.cons('common.industry_type'), option_type: 'int'}
    },
    usci_number: {label: '统一信用代码', type: 'text'},
    artificial_person_name: {label: '法人姓名', type: 'text'},
    tax_identification_number: {label: '纳税人识别号', type: 'text'},

    audit_status: {
        label: '审核状态',
        type: 'select',
        attr: {options: helpers.cons('common.audit_status'), option_type: 'int'}
    },

    is_open: {
        label: '是否启用',
        type: 'select',
        attr: {options: [{code: 1, name: '启用'}, {code: 0, name: '未启用'}], option_type: 'int'}
    },

    create_time: {
        label: '创建日期',
        type: 'dateRange',
        attr: {date_start: 'create_time_start', date_end: 'create_time_end'}
    },
}