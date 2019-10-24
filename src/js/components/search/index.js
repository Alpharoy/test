import common from './common';
import enterprise from './enterprise';
import contract from './contract';
import supplier from './supplier';
import project from './project';
import driver from './driver';
import task from './task';

const smaple = {
    label: '字段名',
    type: '字段类型（text | textarea | select | dateRange | date | area）',
    value: '默认值（可选）',
    attr: {
        options: 'type为select时，option的列表',
        option_type: 'type为select时，option值的类型(int | string)',
        option_remote: 'type为select时，option值是否来源于远程',
        option_remote_method: 'type为select时，option值来源于远程时的调动方法',
        date_start: 'type为dateRange时，起始时间的字段名',
        date_end: 'type为dateRange时，结束时间的字段名',
        level: 'type为area时，地址层级数'
    },
};
export default {
    common: common,
    enterprise: enterprise,
    contract: contract,
    supplier: supplier,
    project: project,
    driver: driver,
    task: task,
}