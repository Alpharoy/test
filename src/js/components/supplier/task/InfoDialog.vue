<template>
    <el-dialog title="任务订单详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs" width="1200px"
               top="60px"
               class="ql-dialog">
        <el-form label-width="100px" auto-complete="off">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="任务编号">
                        <el-input :value="task.task_uuid" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务名称">
                        <el-input :value="task.task_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="录单时间">
                        <ql-date-picker type="datetime" :value="task.record_time" style="width: 100%"
                                        disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input :value="task.contact_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input :value="task.contact_phone_number" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务地址">
                        <el-input :value="task.address_full" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始时间">
                        <ql-date-picker type="datetime" :value="task.start_time" style="width: 100%"
                                        disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间">
                        <ql-date-picker type="datetime" :value="task.end_time" style="width: 100%"
                                        disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务描述">
                        <el-input :value="task.introduce" type="textarea" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="项目">
                        <el-input :value="task.project_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商">
                        <el-input :value="task.supplier_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="企业">
                        <el-input :value="task.enterprise_name" disabled></el-input>
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
                        <el-input :value="task.supplier_subject_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="订单费用">
                        <ql-input-number :value="task.task_fees" :multiple="1/100" :precision="2"
                                         nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务费用">
                        <ql-input-number :value="task.service_charge_fees" :multiple="1/100"
                                         :precision="2" nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="总费用">
                        <ql-input-number :value="task.total_fees" :multiple="1/100"
                                         :precision="2" nullable disabled></ql-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付状态">
                        <el-input :value="task.pay_status_name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付时间">
                        <ql-date-picker type="datetime" :value="task.pay_time"
                                        style="width: 100%" disabled></ql-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
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
            <el-row>
                <el-col :span="8">
                    <el-form-item label="状态">
                        <el-input :value="task.status_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="图片">
                        <picture-upload class="picture-upload" :file-list="taskPictures" disabled
                                        v-if="taskPictures.length"></picture-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <template v-for="attachment in task.attachment">
                            <a href="javascript:;" class="text-info" @click="onFilePreview(attachment)">{{attachment.name}}</a>
                            <br/>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
            <el-button type="primary" @click="acceptFunc" v-if="task.can_accept">接单</el-button>
            <el-button type="primary" @click="updateHandlerFunc" v-if="task.can_update_handler">修改接单人</el-button>
            <el-button type="danger" @click="rejectFunc" v-if="task.can_reject">拒接</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';

    import supplierURL from '../../../api/url/supplier';
    import QlInputNumber from '../../QlInputNumber';
    import QlDatePicker from '../../QlDatePicker';

    export default {
        name: 'InfoDialog',
        components: {QlDatePicker, QlInputNumber},
        data: () => ({
            elVisible: false,
            task: {
                handler_object_group: 30,
                handler_object_uuid: '',
                handler_object_name: '',
                handler_object_phone: '',
                handler_object_certificate_number: '',
                handler_object_bank_name: '',
                handler_object_card_number: '',
                can_update_handler: false,
                can_reject: false,
                can_accept: false,
            },
            taskPictures: [],

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
            canUpdateHandler() {
                return this.task.can_update_handler;
            },
        },
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                this.fetchTask().then(() => {
                    if (this.task.can_accept || this.task.can_update_handler) {
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
            fetchTask() {
                return new Promise((resolve, reject) => {
                    api.supplier().get(helpers.convertURL(supplierURL.get_task, {taskUUID: this.taskUUID})).then((response) => {
                        this.task = response.data;
                        this.taskPictures = _.map(this.task.pictures, (pictureCode) => {
                            return {
                                name: pictureCode,
                                code: pictureCode,
                                url: helpers.getImageURL(pictureCode)
                            }
                        });
                        resolve();
                    });
                });
            },
            searchNaturalPerson(query) {
                return new Promise((resolve, reject) => {
                    api.supplier().get(helpers.convertURL(supplierURL.natural_person_list), {
                        keyword: query,
                        with_bank_card: 1
                    }, {useLoading: false}).then((response) => {
                        this.naturalPersons = response.data;
                        resolve();
                    });
                });
            },
            onClose(refresh = false) {
                helpers.restoreDataToDefault(this, ['task', 'taskPictures', 'naturalPersons', 'naturalPersonBankCards']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
            onFilePreview(file) {
                return helpers.downloadFile(file.code, file.name);
            },
            rejectFunc() {
                this.$confirm('将拒绝此任务订单, 是否继续?', '提示', {type: 'warning'}).then(() => {
                    api.supplier().put(helpers.convertURL(supplierURL.task_reject, {taskUUID: this.taskUUID})).then(response => {
                        this.$message({type: 'success', message: '任务订单拒绝完成'});
                        this.onClose(true);
                    })
                }).catch(err => {
                });
            },
            acceptFunc() {
                api.supplier().put(helpers.convertURL(supplierURL.task_accept, {taskUUID: this.taskUUID}), this.task).then((response) => {
                    this.$message({type: 'success', message: '接单成功'});
                    this.onClose(true);
                });
            },
            updateHandlerFunc() {
                api.supplier().patch(helpers.convertURL(supplierURL.update_task, {taskUUID: this.taskUUID}), this.task).then((response) => {
                    this.$message({type: 'success', message: '更改接单人成功'});
                    this.onClose(true);
                });
            },
            handlerChangeFunc(naturalPerson) {
                this.task.handler_object_uuid = '';
                this.task.handler_object_name = '';
                this.task.handler_object_phone = '';
                this.task.handler_object_certificate_number = '';

                this.naturalPersonBankCards = [];
                this.bankCardChangeFunc('');
                if (_.isObject(naturalPerson)) {
                    this.task.handler_object_uuid = naturalPerson.user_uuid;
                    this.task.handler_object_name = naturalPerson.user_name;
                    this.task.handler_object_phone = naturalPerson.user_phone;
                    this.task.handler_object_certificate_number = naturalPerson.id_card_number;

                    this.naturalPersonBankCards = naturalPerson.natural_person_bank_cards;
                    if (this.naturalPersonBankCards.length) {
                        // 默认选择第一张银行卡
                        this.bankCardChangeFunc(this.naturalPersonBankCards[0]);
                    }
                } else {
                    // 清空自然人搜索列表
                    this.naturalPersons = [];
                }
            },
            bankCardChangeFunc(naturalPersonBankCard) {
                this.task.handler_object_bank_name = '';
                this.task.handler_object_card_number = '';
                if (_.isObject(naturalPersonBankCard)) {
                    this.task.handler_object_bank_name = naturalPersonBankCard.bank_name;
                    this.task.handler_object_card_number = naturalPersonBankCard.card_number;
                }
            },
        },
    };
</script>
<style scoped>
</style>