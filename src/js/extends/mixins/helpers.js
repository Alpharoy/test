export default {
    data() {
        return {
            mixinTableHeight: 300,
        };
    },

    methods: {
        /**
         * 数字保留几位小数
         *
         * @param num
         * @param {number} precision
         * @returns {number}
         */
        toFixed(num, precision) {
            return parseFloat(Number(num).toFixed(precision));
        },

        /**
         * 将当前页面部分data恢复为默认值
         *
         * @param {...(string|string[])} paths
         * @returns {Object}
         */
        restoreDataToDefault(paths = null) {
            const defaultData = this.$options.data.apply(this);
            let assignData = defaultData;
            if (paths) {
                assignData = _.pick(defaultData, paths);
            }

            return Object.assign(this.$data, assignData);
        },

        /**
         * 生成请求url
         * @param url
         * @param parameter
         * @returns {*}
         */
        convertURL(url, parameter = {}) {
            _.templateSettings.interpolate = /{([\s\S]+?)}/g;
            let compiled = _.template(url);
            url = compiled(_.mapValues(parameter, (value) => {
                return encodeURIComponent(value);
            }));
            return url;
        },

        /**
         * 设置表格高度
         * 注：必须使用 ref="computedHeightId" 为测量容器
         * @param  otherHeight 要减去的多余高度
         */
        mixinSetTableHeight(otherHeight) {
            this.$nextTick(() => {
                let elementHeight = (this.$refs.computedHeightId.$el || this.$refs.computedHeightId)['offsetHeight'];
                let tableHeight = elementHeight - otherHeight;
                tableHeight = tableHeight <= 300 ? 300 : tableHeight;
                this.mixinTableHeight = tableHeight;
            });
        },
    },
};