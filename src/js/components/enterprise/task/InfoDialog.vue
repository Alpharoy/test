<template>
    <el-dialog title="任务订单详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               top="60px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off">
            <el-row>
                <el-col :span="8" v-if="!creating">
                    <el-form-item label="任务编号">
                        <el-input :value="task.task_uuid" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务名称">
                        <el-input v-model="task.task_name" maxlength="64" placeholder="请输入任务名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="录单时间" v-if="!creating">
                        <ql-date-picker type="datetime" :value="task.record_time" style="width: 100%"
                                        disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="task.contact_name" maxlength="32" placeholder="请输入联系人姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="task.contact_phone_number" maxlength="11"
                                  placeholder="请输入联系人手机号码"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务地址">
                        <ur-area-cascader v-model="task.address_code" select-any-level clearable
                                          style="margin-bottom: 6px;"></ur-area-cascader>
                        <el-input v-model="task.address_detail" maxlength="64" placeholder="请输入任务详细地址"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始时间">
                        <ql-date-picker type="datetime" v-model="task.start_time" style="width: 100%"
                                        placeholder="请选择任务开始时间"></ql-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间">
                        <ql-date-picker type="datetime" v-model="task.end_time" style="width: 100%"
                                        placeholder="请选择任务结束时间"></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务描述">
                        <el-input v-model="task.introduce" type="textarea" placeholder="请选择任务描述"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="项目">
                        <el-select :value="task.project_name" style="width: 100%"
                                   filterable
                                   default-first-option
                                   remote
                                   :remote-method="searchProject"
                                   placeholder="请输入关键字搜索项目"
                                   clearable
                                   value-key="project_uuid"
                                   @change="projectChangeFunc"
                                   v-if="canUpdateProject">
                            <el-option
                                    v-for="project in projects"
                                    :key="project.project_uuid"
                                    :label="project.project_name"
                                    :value="project"
                            ></el-option>
                        </el-select>
                        <el-input :value="task.project_name" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商">
                        <el-input :value="task.supplier_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="">
                        <el-checkbox :value="task.is_auto_accept" disabled>自动接单</el-checkbox>
                        <el-checkbox :value="task.is_auto_complete" disabled>自动完成</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行业类型">
                        <el-input :value="task.industry_type_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="科目">
                        <el-select :value="task.supplier_subject_name" style="width: 100%"
                                   placeholder="请选择科目"
                                   clearable
                                   value-key="supplier_subject_uuid"
                                   @change="supplierSubjectChangeFunc">
                            <el-option
                                    v-for="supplierSubject in supplierSubjects"
                                    :key="supplierSubject.supplier_subject_uuid"
                                    :label="supplierSubject.supplier_subject_name"
                                    :value="supplierSubject"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="订单费用">
                        <ql-input-number v-model="task.task_fees" :multiple="1/100" :precision="2"
                                         nullable></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务费用">
                        <ql-input-number :value="serviceChargeFees" :multiple="1/100"
                                         :precision="2" nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="!creating">
                <el-col :span="8">
                    <el-form-item label="总费用">
                        <ql-input-number :value="totalFees" :multiple="1/100"
                                         :precision="2" nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付状态">
                        <el-input :value="task.service_charge_fee_pay_status_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付时间">
                        <ql-date-picker type="datetime" :value="task.service_charge_fee_pay_time"
                                        style="width: 100%" disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="!creating">
                <el-col :span="8">
                    <el-form-item label="接单费用">
                        <ql-input-number :value="task.task_fees" :multiple="1/100" :precision="2"
                                         nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付状态">
                        <el-input :value="task.handler_pay_status_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付时间">
                        <ql-date-picker type="datetime" :value="task.handler_pay_time"
                                        style="width: 100%" disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="接单人">
                        <el-select :value="task.handler_object_name" style="width: 100%"
                                   filterable
                                   default-first-option
                                   remote
                                   :remote-method="searchNaturalPerson"
                                   placeholder="请输入关键字搜索自然人"
                                   clearable
                                   value-key="user_uuid"
                                   @change="handlerChangeFunc"
                                   v-if="canUpdateHandler">
                            <el-option
                                    v-for="naturalPerson in naturalPersons"
                                    :key="naturalPerson.user_uuid"
                                    :label="naturalPerson.user_name + '（' + naturalPerson.user_phone + '）'"
                                    :value="naturalPerson"
                            >
                            </el-option>
                        </el-select>
                        <el-input :value="task.handler_object_name" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码">
                        <el-input :value="task.handler_object_phone" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="证件号码">
                        <el-input :value="task.handler_object_certificate_number" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="银行卡号">
                        <el-select :value="task.handler_object_card_number" style="width: 100%"
                                   placeholder="请选择订单收款银行卡"
                                   default-first-option
                                   clearable
                                   value-key="bank_card_uuid"
                                   @change="bankCardChangeFunc"
                                   v-if="canUpdateHandler">
                            <el-option
                                    v-for="bankCard in naturalPersonBankCards"
                                    :key="bankCard.bank_card_uuid"
                                    :label="bankCard.card_number + ' | ' + bankCard.bank_name"
                                    :value="bankCard"
                            >
                            </el-option>
                        </el-select>
                        <el-input :value="task.handler_object_card_number" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="银行名称">
                        <el-input :value="task.handler_object_bank_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="!creating">
                <el-col :span="8">
                    <el-form-item label="状态">
                        <el-input :value="task.status_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来源">
                        <el-input :value="task.source_from_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来源单号">
                        <el-input :value="task.source_from_uuid" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="图片">
                        <picture-upload class="picture-upload" :limit="3" :file-list="taskPictures"
                                        @uploadSuccess="onPictureUploadSuccess"
                                        @uploadRemove="onPictureRemove"></picture-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <ur-file-upload ref="upload" :file-list="taskAttachments" :limit="3" @onRemove="onFileRemove"
                                        @onSuccess="onFileUploadSuccess" @onPreview="onFilePreview">
                            <el-button type="text" slot="trigger">添加附件</el-button>
                        </ur-file-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="createFunc" v-if="creating">新增</el-button>
            <el-button type="primary" @click="updateFunc" v-else>更新</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';

    import enterpriseURL from '../../../api/url/enterprise';
    import QlInputNumber from '../../QlInputNumber';
    import QlDatePicker from '../../QlDatePicker';

    import taskMixin from './mixins';
    import UrAreaCascader from '../../UrAreaCascader';
    import PictureUpload from '../../PictureUpload';
    import UrFileUpload from '../../UrFileUpload';

    export default {
        name: 'InfoDialog',
        components: {UrFileUpload, PictureUpload, UrAreaCascader, QlDatePicker, QlInputNumber},
        mixins: taskMixin,
        data: () => ({
            elVisible: false,

            task: {
                address_code: '',
                address_name: '',
                address_detail: '',

                project_uuid: '',
                project_name: '',
                supplier_uuid: '',
                supplier_name: '',
                industry_type_code: '',
                industry_type_name: '',
                supplier_subject_uuid: '',
                supplier_subject_name: '',
                is_auto_accept: false,
                is_auto_complete: false,

                task_fees: null,
                project_service_charge: null,

                handler_object_group: 30,
                handler_object_uuid: '',
                handler_object_name: '',
                handler_object_phone: '',
                handler_object_certificate_number: '',
                handler_object_bank_name: '',
                handler_object_card_number: '',
                can_update_handler: true,
                can_update_project: true,

                attachment: [],
                pictures: [],
            },

            taskPictures: [],
            taskAttachments: [],

            projects: [],
            supplierSubjects: [],
            naturalPersons: [],
            naturalPersonBankCards: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            taskUuid: {
                type: String,
                default: null,
            },
        },
        computed: {
            taskUUID() {
                return this.taskUuid;
            },
            creating() {
                return !this.taskUUID;
            },
            canUpdateHandler() {
                return this.task.can_update_handler;
            },
            canUpdateProject() {
                return this.task.can_update_project;
            },
            serviceChargeFees() {
                const serviceChargeFees = this.task.task_fees * this.task.project_service_charge / 10000;
                return isNaN(serviceChargeFees) ? null : serviceChargeFees;
            },
            totalFees() {
                const totalFees = this.task.task_fees + this.serviceChargeFees;
                return isNaN(totalFees) ? null : totalFees;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },

        },
        methods: {
            onOpen() {
                if (this.creating) {
                    return;
                }
                this.fetchTask().then((response) => {
                    // 获取科目
                    this.searchSupplierSubject(this.task.supplier_uuid, this.task.industry_type_code);

                    if (this.canUpdateHandler) {
                        // 填充搜索的自然人列表
                        return this.searchNaturalPerson(this.task.handler_object_phone);
                    }
                }).then(() => {
                    let currentNaturalPerson = _.find(this.naturalPersons, {user_uuid: this.task.handler_object_uuid});
                    currentNaturalPerson = currentNaturalPerson || {};
                    // 填充当前自然人的银行卡列表
                    this.naturalPersonBankCards = currentNaturalPerson.natural_person_bank_cards || [];
                });
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['task', 'taskPictures', 'taskAttachments', 'projects', 'supplierSubjects', 'naturalPersons', 'naturalPersonBankCards']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            createFunc() {
                api.enterprise().post(helpers.convertURL(enterpriseURL.add_task), this.task).then((response) => {
                    this.$message({type: 'success', message: '新增任务订单成功'});
                    this.onClose(true);
                });
            },
            updateFunc() {
                api.enterprise().patch(helpers.convertURL(enterpriseURL.update_task, {taskUUID: this.taskUUID}), this.task).then((response) => {
                    this.$message({type: 'success', message: '更新任务订单成功'});
                    this.onClose(true);
                });
            },
        },
    };
</script>
<style scoped>
</style>