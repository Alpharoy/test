export default {
    // 通用审核状态
    audit_status: [
        {
            code: 10,
            name: '未审核',
        },
        {
            code: 80,
            name: '未通过',
        },
        {
            code: 99,
            name: '已通过',
        },
    ],

    // 证件类型
    certificate_type: [
        {
            code: '10',
            name: '身份证',
        },
        {
            code: '20',
            name: '港澳通行证',
        },
        {
            code: '30',
            name: '护照',
        },
        {
            code: '40',
            name: '其他',
        },
    ],

    // 行业类型
    industry_type: [
        {code: 'A', name: '农、林、牧、渔业'},
        {code: 'B', name: '采矿业'},
        {code: 'C', name: '制造业'},
        {code: 'D', name: '电力、热力、燃气及水生产和供应业'},
        {code: 'E', name: '建筑业'},
        {code: 'F', name: '批发和零售业'},
        {code: 'G', name: '交通运输、仓储和邮政业'},
        {code: 'H', name: '住宿和餐饮业'},
        {code: 'I', name: '信息传输、软件和信息技术服务业'},
        {code: 'J', name: '金融业'},
        {code: 'K', name: '房地产业'},
        {code: 'L', name: '租赁和商务服务业'},
        {code: 'M', name: '科学研究和技术服务业'},
        {code: 'N', name: '水利、环境和公共设施管理业'},
        {code: 'O', name: '居民服务、修理和其他服务业'},
        {code: 'P', name: '教育'},
        {code: 'Q', name: '卫生和社会工作'},
        {code: 'R', name: '文化、体育和娱乐业'},
        {code: 'S', name: '公共管理、社会保障和社会组织'},
        {code: 'T', name: '国际组织'},
    ],

    // 用工类型
    employee_type: [
        {code: '10', name: '灵活就业'},
        {code: '20', name: '个人独资'},
    ],

    // 性别
    sex_type: [
        {code: '1', name: '男'},
        {code: '2', name: '女'},
        {code: '3', name: '未知'},
    ],

    // 银行标识符
    bank_identity: [
        {code: 'ICBC', name: '中国工商银行'},
        {code: 'ABC', name: '中国农业银行'},
        {code: 'BOC', name: '中国银行'},
        {code: 'CCB', name: '中国建设银行'},
        {code: 'BCOM', name: '交通银行'},
        {code: 'CITIC', name: '中信银行'},
        {code: 'CEB', name: '中国光大银行'},
        {code: 'HXB', name: '华夏银行'},
        {code: 'CMBC', name: '中国民生银行'},
        {code: 'GDB', name: '广东发展银行'},
        {code: 'CMB', name: '招商银行'},
        {code: 'CIB', name: '兴业银行'},
        {code: 'SPDB', name: '上海浦东发展银行'},
        {code: 'CBHB', name: '渤海银行'},
        {code: 'PSBC', name: '中国邮政储蓄'},
        {code: 'SDB', name: '深圳发展银行'},
        {code: 'SHB', name: '上海银行'},
        {code: 'BOB', name: '北京银行'},
        {code: 'BJRCB', name: '北京农村商业银行'},
        {code: 'PAB', name: '平安银行'},
        {code: 'BSB', name: '包商银行'},
        {code: 'GRC', name: '广州农村商业银行'},
        {code: 'HSB', name: '徽商银行'},
        {code: 'HDCB', name: '邯郸银行'},
        {code: 'JSB', name: '江苏银行'},
        {code: 'GDRCU', name: '广东省农村信用社联合社'},
        {code: 'GZCB', name: '广州银行'},
        {code: 'SZRCB', name: '深圳农村商业银行'},
        {code: 'DRCB', name: '东莞农村商业银行'},
        {code: 'HRCB', name: '湖北农村商业银行'},
    ],
}