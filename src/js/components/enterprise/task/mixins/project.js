import api from '../../../../api';
import enterpriseURL from '../../../../api/url/enterprise';
import helpers from '../../../../extends/helpers';

export default {
    methods: {
        searchProject(query) {
            return new Promise((resolve, reject) => {
                api.enterprise().get(helpers.convertURL(enterpriseURL.project_list), {
                    project_name: query,
                    is_open: 1,
                    is_industry_type_open: 1,
                    audit_status: 99,
                }, {useLoading: false}).then((response) => {
                    this.projects = response.data;
                })
            });
        },
        projectChangeFunc(project) {
            this.task.project_uuid = '';
            this.task.project_name = '';
            this.task.supplier_name = '';
            this.task.industry_type_code = '';
            this.task.industry_type_name = '';
            this.task.is_auto_accept = false;
            this.task.is_auto_complete = false;
            this.task.project_service_charge = null;
            this.supplierSubjectChangeFunc('');
            if (_.isObject(project)) {
                this.task.project_uuid = project.project_uuid;
                this.task.project_name = project.project_name;
                this.task.supplier_name = project.supplier_name;
                this.task.industry_type_code = project.industry_type_code;
                this.task.industry_type_name = project.industry_type_name;
                this.task.is_auto_accept = project.is_auto_accept;
                this.task.is_auto_complete = project.is_auto_complete;
                this.task.project_service_charge = project.service_charge;
                this.searchSupplierSubject(project.supplier_uuid, project.industry_type_code);
            }
        },
        searchSupplierSubject(supplierUUID, industryTypeCode) {
            return new Promise((resolve, reject) => {
                api.enterprise().get(helpers.convertURL(enterpriseURL.supplier_subject_list, {supplierUUID: supplierUUID}), {
                    industry_type_code: industryTypeCode
                }, {useLoading: false}).then((response) => {
                    this.supplierSubjects = response.data;
                })
            });
        },
        supplierSubjectChangeFunc(supplierSubject) {
            this.task.supplier_subject_uuid = '';
            this.task.supplier_subject_name = '';
            if (_.isObject(supplierSubject)) {
                this.task.supplier_subject_uuid = supplierSubject.supplier_subject_uuid;
                this.task.supplier_subject_name = supplierSubject.supplier_subject_name;
            }
        },
    }
}