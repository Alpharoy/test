import api from '../../../../api';
import enterpriseURL from '../../../../api/url/enterprise';
import helpers from '../../../../extends/helpers';

export default {
    methods: {
        fetchTask() {
            return new Promise((resolve, reject) => {
                api.enterprise().get(helpers.convertURL(enterpriseURL.get_task, {taskUUID: this.taskUUID})).then((response) => {
                    this.task = response.data;
                    this.taskPictures = _.map(this.task.pictures, (pictureCode) => {
                        return {
                            name: pictureCode,
                            code: pictureCode,
                            url: helpers.getImageURL(pictureCode)
                        }
                    });
                    this.taskAttachments = _.map(this.task.attachment, (taskAttachment) => {
                        return {
                            name: taskAttachment.name,
                            code: taskAttachment.code,
                            url: helpers.getFileURL(taskAttachment.code),
                        }
                    });
                    resolve();
                });
            });
        },

        onFileRemove(file, fileList) {
            this.task.attachment = _.map(fileList, (file) => {
                // 来自刚上传的文件
                if (file.response) {
                    return {code: file.response[0]['file_code'], name: file.response[0]['file_name']}
                }
                return {name: file.name, code: file.code};
            });
        },
        onFileUploadSuccess(response, file, fileList) {
            this.task.attachment.push({code: response[0]['file_code'], name: response[0]['file_name']});
        },
        onFilePreview(file) {
            return helpers.downloadFile(file.code, file.name);
        },

        onPictureUploadSuccess(code) {
            this.task.pictures.push(code);
        },
        onPictureRemove(code) {
            const index = _.findIndex(this.task.pictures, (pictureCode) => {
                return pictureCode === code;
            });
            if (index !== -1) {
                this.task.pictures.splice(index, 1);
            }
        },

    }
}