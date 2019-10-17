<template>
    <el-dialog title="图片查看"
               :visible.sync="innerShowDialog"
               :append-to-body="true"
               top="30px"
               custom-class="picture-dialog" @open="open" @close="close">
        <div class="loading-container" v-show="loading">
            <span class="el-icon-loading"></span>
        </div>
        <div class="picture-container">
            <div class="btn-container left"><i class="el-icon-d-arrow-left icon" @click="change(-1)"></i></div>
            <div class="img-container"><img :src="currentImageSrc" :style="imgStyle"/></div>
            <div class="btn-container right"><i class="el-icon-d-arrow-right icon" @click="change(1)"></i></div>
        </div>
        <div class="picture-page">
            <el-pagination
                    :small="true"
                    :page-size="1"
                    :total="listLength"
                    :current-page="currentIndex"
                    layout="prev, pager, next, slot" @current-change="pageChange">
                <span> 当前第 {{ currentIndex }} 张 / 总共 {{ listLength }} 张 </span>
            </el-pagination>
        </div>
    </el-dialog>
</template>
<script>
    import helpers from '../extends/helpers';

    export default {
        name: 'PictureDialog',
        data: () => ({
            pictureList: [],
            listLength: 0,
            loading: false,
            currentIndex: 1,
            currentImageSrc: '',
            dataShowDialog: false,
            defaultImgStyle: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
            },
            imgStyle: {},
        }),
        props: {
            showDialog: {
                type: Boolean,
            },
            fileList: {
                type: Array,
            },
            index: {
                type: Number,
                default: 1,
            },
            useOss: {
                type: Boolean,
                default: true,
            },
        },
        computed: {
            // 因为这里需要支持点击位置关闭对话框，所以需要不同做法
            innerShowDialog: {
                get: function () {
                    return this.showDialog || this.dataShowDialog;
                },
                set: function () {
                    this.dataShowDialog = false;
                },
            },
        },
        methods: {
            open() {
                let pictureList = [];
                if (this.useOss) {
                    _.forIn(this.fileList, (code) => {
                        pictureList.push(helpers.getImageURL(code));
                    });
                } else {
                    pictureList = this.fileList.slice();
                }
                this.pictureList = pictureList;
                this.currentIndex = this.index;
                this.listLength = pictureList.length;
                this.dataShowDialog = true;
                this.imgStyle = _.cloneDeep(this.defaultImgStyle);
                this.change(0);
            },
            close() {
                this.dataShowDialog = false;
                this.$emit('close');
            },
            pageChange(page) {
                this.change(page - this.currentIndex);
            },
            change(step) {
                this.loading = true;
                let currentIndex = this.currentIndex + step;
                if (currentIndex === 0) {
                    currentIndex = this.listLength;
                } else if (currentIndex > this.listLength) {
                    currentIndex = 1;
                }
                this.currentIndex = currentIndex;
                let image = new Image(), src = this.pictureList[currentIndex - 1];
                image.src = src;
                image.onload = () => {
                    const maxWidth = 600, maxHeight = 600;
                    const imgWidth = image.width, imgHeight = image.height;
                    const scaleWidth = imgWidth / maxWidth, scaleHeight = imgHeight / maxHeight;

                    let top, left, width, height;
                    if (scaleWidth >= scaleHeight) {
                        left = 0;
                        height = imgHeight / scaleWidth;
                        top = (maxHeight - height) / 2;
                        height += 'px';
                        width = '100%';
                    } else {
                        top = 0;
                        width = imgWidth / scaleHeight;
                        left = (maxWidth - width) / 2;
                        width += 'px';
                        height = '100%';
                    }
                    this.imgStyle = {
                        top: top + 'px',
                        bottom: top + 'px',
                        left: left + 'px',
                        right: left + 'px',
                        width: width,
                        height: height,
                    };
                    this.loading = false;
                    this.currentImageSrc = src;
                };
            },
        },
    };
</script>
<style scoped>
</style>