<template>
    <div class="search-widget">
        <i class="display-tips" @click="searchVisible">
            <span v-if="isDisplay" class="el-icon-caret-top" title="隐藏搜索栏"></span>
            <span v-else class="el-icon-caret-bottom" title="显示搜索栏"></span>
        </i>
        <el-card class="box-card">
            <el-form :inline="true" label-width="100px" v-show="isDisplay" @submit.native.prevent>

                <template v-for="(field, index) in fields">
                    <el-form-item :label="field.label"
                                  :class="(field.type === 'textarea' ? 'multiple-waybill-uuid' : '')" :key="index">
                        <template v-if="field.type === 'text' || field.type === 'textarea'">
                            <el-input v-model="fieldValues[index]" :type="field.type" :placeholder="'请输入' + field.label"
                                      resize="none" :maxlength="(field.type === 'textarea' ? 1024 : 32)"></el-input>
                        </template>
                        <template v-if="field.type === 'select'">
                            <el-select v-model="fieldValues[index]" placeholder="请选择" clearable filterable>
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in selectOptions[index]"
                                           :key="item.code"
                                           :value="item.code"
                                           :label="item.name">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-if="field.type === 'dateRange'">
                            <ql-date-picker v-model="fieldValues[field.attr.date_start]" type="date"
                                            :placeholder="'请选择起始' + field.label"
                                            style="width:180px;"></ql-date-picker>
                            ~
                            <ql-date-picker v-model="fieldValues[field.attr.date_end]" type="date"
                                            :placeholder="'请选择结束' + field.label"
                                            style="width:180px;"></ql-date-picker>
                        </template>
                        <template v-if="field.type === 'date'">
                            <ql-date-picker v-model="fieldValues[index]" type="date"
                                            :placeholder="'请选择' + field.label"
                            ></ql-date-picker>
                        </template>
                        <template v-if="field.type === 'area'">
                            <ur-area-cascader v-model="fieldValues[index]" :level="field.attr.level"
                                              select-any-level clearable
                                              style="margin-bottom: 4px"></ur-area-cascader>
                        </template>
                        <template v-if="field.type === 'checkbox'">
                            <el-checkbox v-model="fieldValues[index]"></el-checkbox>
                        </template>
                    </el-form-item>
                </template>

                <el-form-item class="el-form-button">
                    <el-button type="primary" @click="submitSearch">查询</el-button>
                    <el-button type="primary" @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import helpers from '../../extends/helpers';
    import groupSearchFields from './index';
    import QlDatePicker from '../QlDatePicker';
    import UrAreaCascader from '../UrAreaCascader';

    export default {
        name: 'Search',
        components: {UrAreaCascader, QlDatePicker},
        data: () => ({
            isDisplay: true,

            fieldValues: {},

            selectOptions: {},
        }),
        props: {
            searchFields: {
                type: Array,
                required: true,
            },
        },
        computed: {
            fields() {
                return _.pick(this.allSearchFields, this.searchFields);
            },
            allSearchFields() {
                let allFields = {};
                _.forIn(groupSearchFields, (searchFields) => {
                    _.assignIn(allFields, searchFields);
                });
                return allFields;
            },
        },
        mounted() {
            this.init();
        },
        watch: {
            '$route'(to, from) {
                this.init();
            },
        },
        methods: {
            init() {
                this.resetSearch();
                let query = this.$route.query;
                _.forIn(query, (value, key) => {
                    let field = this.fields[key];
                    if (field && field.type === 'select' && field.attr.option_type === 'int') {
                        // 从路由中获取到是字符串，要转为整型才能匹配上
                        query[key] = parseInt(value);
                    }
                });
                this.fieldValues = helpers.searchArgBuild(this.fieldValues, query);

                this.fetchRemoteSelect();
            },
            fetchRemoteSelect() {
                _.forIn(this.fields, (field, fieldName) => {
                    if (field.type !== 'select') {
                        return true;
                    }
                    if (this.selectOptions[fieldName] && this.selectOptions[fieldName].length) {
                        return true;
                    }

                    let addSelectOptions = {};
                    addSelectOptions[fieldName] = field.attr.options ? field.attr.options : [];
                    this.selectOptions = Object.assign({}, this.selectOptions, addSelectOptions);

                    // 如果select的option来源于远程搜索
                    if (field.attr.option_remote && _.isFunction(this.$parent[field.attr.option_remote_method])) {
                        this.$parent[field.attr.option_remote_method]().then((options) => {
                            addSelectOptions[fieldName] = options;
                            this.selectOptions = Object.assign({}, this.selectOptions, addSelectOptions);
                        });
                    }
                });
            },
            submitSearch() {
                helpers.queryRoute(this.$router, 1, {query: this.fieldValues});
            },
            resetSearch() {
                this.fieldValues = _.mapValues(this.fields, (field) => {
                    return field.value ? field.value : '';
                });
            },
            searchVisible() {
                this.isDisplay = !this.isDisplay;
            },
        },

    }
</script>

<style scoped>

</style>