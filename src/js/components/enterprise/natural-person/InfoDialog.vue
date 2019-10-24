<template>
    <el-dialog title="自然人详情" :visible="elVisible" @close="onClose(false)" @open="onOpen" v-bind="$attrs"
               width="1200px"
               class="ql-dialog">
        <el-form label-width="120px" auto-complete="off" :disabled="true">
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>身份证件</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证正面">
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    :file-list="certificatePhotoFront" disabled></picture-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证背面">
                            <picture-upload
                                    class="picture-upload"
                                    :limit="1"
                                    :file-list="certificatePhotoBack" disabled></picture-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form-box-card">
                <div class="el-card-info-title">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <el-input :value="naturalPerson.user_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号码">
                            <el-input :value="naturalPerson.user_phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别">
                            <el-input :value="naturalPerson.sex_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生日">
                            <ql-date-picker type="date" :value="naturalPerson.birthday"></ql-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系地址">
                            <el-input :value="naturalPerson.contact_address"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-input :value="naturalPerson.status_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件号码">
                            <el-input :value="naturalPerson.id_card_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="注册时间">
                            <ql-date-picker type="datetime" :value="naturalPerson.create_time"></ql-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户来源">
                            <el-input :value="naturalPerson.source_from_name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="elVisible = false">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import api from '../../../api';
    import helpers from '../../../extends/helpers';
    import enterpriseURL from '../../../api/url/enterprise';
    import QlDatePicker from '../../QlDatePicker';
    import PictureUpload from '../../PictureUpload';

    export default {
        name: 'InfoDialog',
        components: {PictureUpload, QlDatePicker},
        data: () => ({
            elVisible: false,
            naturalPerson: {},
            certificatePhotoFront: [],
            certificatePhotoBack: [],
        }),
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            uuid: {
                type: String,
            },
        },
        computed: {},
        watch: {
            visible(val) {
                this.elVisible = val;
            },
        },
        methods: {
            onOpen() {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_enterprise_natural_person, {userUUID: this.uuid})).then((response) => {
                    this.naturalPerson = response.data.natural_person;
                    if (this.naturalPerson.certificate_photo_front) {
                        this.certificatePhotoFront = [{
                            name: this.naturalPerson.certificate_photo_front,
                            code: this.naturalPerson.certificate_photo_front,
                            url: helpers.getImageURL(this.naturalPerson.certificate_photo_front)
                        }];
                    }
                    if (this.naturalPerson.certificate_photo_back) {
                        this.certificatePhotoBack = [{
                            name: this.naturalPerson.certificate_photo_back,
                            code: this.naturalPerson.certificate_photo_back,
                            url: helpers.getImageURL(this.naturalPerson.certificate_photo_back)
                        }];
                    }
                });
            },
            onClose(refresh = false) {
                // 避免打开时，看到部分展示的动画，故还原数据在此进行
                helpers.restoreDataToDefault(this, ['naturalPerson', 'certificatePhotoFront', 'certificatePhotoBack']);
                this.elVisible = false;
                this.$emit('update:visible', false);
                this.$emit('close', refresh);
            },
        },
    };
</script>
<style lang="scss" scoped>
</style>