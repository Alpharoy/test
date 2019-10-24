import helpers from '../../extends/helpers';

export default {
    task_uuid: {label: '任务编号', type: 'text'},
    task_name: {label: '任务名称', type: 'text'},
    task_status: {
        label: '任务状态',
        type: 'select',
        attr: {options: helpers.cons('task.status'), option_type: 'int'}
    },
}