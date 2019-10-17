<template>
    <div :class="hideUpload">
        <el-upload
                :action="uploadUrl"
                ref="pictureUpload"
                accept="image/*"
                name="files[]"
                :data="uploadData"
                :multiple="false"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
                list-type="picture-card"
                :on-remove="uploadRemove"
                :on-progress="uploadProgress"
                :limit="limit"
                :file-list="innerFileList"
                v-bind="$attrs"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import api from '../api/index';
    import commonURL from '../api/url/common';
    import helpers from '../extends/helpers';
    import config from '../config/index';

    export default {
        name: 'PictureUpload',
        components: {},
        data: () => ({
            uploadUrl: config.API_OSS_BASE_URI + '/api/images',
            uploadData: {},

            uploadCount: 0,
            uploadingCount: 0,

            messageObj: '',

            innerFileList: [],

            dialogImageUrl: '',
            dialogVisible: false
        }),
        props: {
            limit: {
                type: Number,
                default: 6,
            },
            fileList: {
                // [{name: '', code: '', url: ''}, {name: '', code: '', url: ''}]
                type: Array,
                default: function () {
                    return [];
                }
            },
        },
        watch: {
            uploadingCount(to, from) {
                if (from === 0 && to > 0) {
                    this.messageObj = this.$message({
                        message: '图片上传中...',
                        type: 'warning',
                        duration: 0,
                        showClose: false,
                    });
                } else if (from > 0 && to === 0) {
                    this.messageObj.close();
                }
            },
            fileList(to, from) {
                this.innerFileList = _.cloneDeep(to);
                this.uploadCount = this.innerFileList.length;
            }
        },
        computed: {
            hideUpload: function () {
                let className = '';
                if (this.uploadCount >= this.limit) {
                    className = 'hide-upload';
                }
                return className;
            },
        },
        mounted: function () {
            // TODO：这里有个问题，如果组件先挂载，fileList后赋值，这里不会执行，暂时用 watch fileList 的做法hack先
            this.$nextTick(function () {
                this.innerFileList = _.cloneDeep(this.fileList);
                this.uploadCount = this.innerFileList.length;
            });
        },
        methods: {
            uploadSuccess(response, file, fileList) {
                this.uploadingCount--;
                const code = response[0]['file_code'];
                this.$emit('uploadSuccess', code);
            },
            uploadError(err, file, fileList) {
                this.uploadCount--;
                this.uploadingCount--;
                helpers.errorHandler({data: JSON.parse(err.message)});
            },
            beforeUpload(file) {
                this.uploadCount++;
                this.uploadingCount++;
                return new Promise((resolve, reject) => {
                    // 请求图片服务器的token
                    api.common().post(helpers.convertURL(commonURL.image_token), {}, {useLoading: false}).then((response) => {
                        if (_.isEmpty(response.data.access_token)) {
                            this.tokenError(reject);
                            return false;
                        }
                        this.uploadData = {access_token: response.data.access_token};
                        resolve();
                    }).catch((err) => {
                        this.tokenError(reject);
                    });
                });
            },
            tokenError(reject) {
                this.uploadCount--;
                this.uploadingCount--;
                this.$message({
                    showClose: true,
                    message: '获取图片服务器token失败',
                    type: 'error',
                });
                reject(new Error('获取图片服务器token失败'));
            },
            uploadRemove(file, fileList) {
                this.uploadCount--;
                if (file['response']) {
                    const code = file['response'][0]['file_code'];
                    this.$emit('uploadRemove', code);
                } else if (file.code) {
                    // 初始化中的fileList中删除
                    this.$emit('uploadRemove', file.code);
                } else {
                    this.uploadingCount--;
                }
            },
            uploadProgress(event, file, fileList) {

            },
            uploadCancel() {
                this.$refs.pictureUpload.clearFiles();
                this.uploadCount = 0;
                this.uploadingCount = 0;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
        },
    };
</script>
<style>
    .hide-upload .el-upload {
        display: none;
    }
</style>