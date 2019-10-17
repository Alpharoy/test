<template>
    <el-upload
            ref="upload"
            :action="uploadUrl"
            name="files[]"
            :data="uploadData"
            :before-upload="onBeforeUpload"
            v-bind="$attrs"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
    >
        <slot></slot>
        <slot name="trigger" slot="trigger"></slot>
        <slot name="tip" slot="tip"></slot>
    </el-upload>
</template>
<script>
    import api from '../api/index';
    import commonURL from '../api/url/common';
    import config from '../config/index';
    import helpers from '../extends/helpers';

    export default {
        name: 'UrFileUpload',
        components: {},
        data() {
            return {
                uploadUrl: config.API_OSS_BASE_URI + '/api/files',
                uploadData: {
                    expiry_time: this.expireIn,
                },
            };
        },
        props: {
            expireIn: {
                type: Number,
                default: 60 * 24 * 30, // 默认有效期一个月
            },
        },
        watch: {},
        computed: {},
        methods: {
            onBeforeUpload(file) {
                // 获取文件上传token
                return api.common().post(helpers.convertURL(commonURL.file_token), {}, {useLoading: false}).then(response => {
                    const accessToken = response.data.access_token;

                    if (!accessToken) {
                        return Promise.reject(new Error('上传初始化失败'));
                    }

                    this.uploadData['access_token'] = accessToken;
                });
            },

            clearFiles() {
                this.$refs.upload.clearFiles();
            },

            abort() {
                this.$refs.upload.abort();
            },

            submit() {
                this.$refs.upload.submit();
            },

            handlePreview(file) {
                this.$emit('onPreview', file);
            },

            handleRemove(file, fileList) {
                this.$emit('onRemove', file, fileList);
            },

            handleExceed(file, fileList) {
                this.$emit('onExceed', file, fileList);
            },

            handleSuccess(response, file, fileList) {
                this.$emit('onSuccess', response, file, fileList);
            },
        },
    };
</script>
<style>
</style>