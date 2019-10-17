<template>
    <el-cascader
            ref="area"
            :options="visibleAreaTree"
            :props="props"
            :value="elValues"
            :change-on-select="false"
            expand-trigger="hover"
            :separator="separator"
            :placeholder="placeholder"
            style="width: 100%;"
            @active-item-change="onActiveItemChange"
            @change="onChange"
            v-bind="$attrs"
            filterable
    ></el-cascader>
</template>
<script>
    export default {
        name: 'UrAreaCascader',
        model: {
            prop: 'value',
            event: 'change',
        },
        props: {
            value: {
                type: [String, Array],
                default: null,
            },
            level: {
                type: Number,
                default: 4,
            },
            minLevel: {
                type: Number,
                default: 2,
            },
            selectAnyLevel: {
                type: Boolean,
                default: false,
            },
            separator: {
                type: String,
                default: '',
            },
            placeholder: {
                type: String,
                default: '请选择省市区',
            },
            debounce: {
                type: Number,
                default: 400
            },
        },
        data() {
            return {
                elValues: [],
                areas: {},
                props: {
                    value: 'code',
                    label: 'name',
                    children: 'children',
                }
            }
        },
        computed: {
            // 实际上我们使用地址库的服务器level会比控件高一级，因为还有个国家
            realLevel() {
                return this.level + 1;
            },
            areaChinaCode() {
                return this.$store.state.area.china.code;
            },
            visibleAreaTree() {
                const makeAreaInvisible = (areas) => {
                    if (_.size(areas) === 0) {
                        return [];
                    }

                    return _.forEach(areas, area => {
                        // 当前层级大于等于允许显示的层级，进行隐藏子集处理
                        if (area.level >= this.realLevel) {
                            _.unset(area, 'children');
                        } else {
                            makeAreaInvisible(area.children);
                        }
                    });
                };

                return makeAreaInvisible(_.get(this.areas, this.areaChinaCode + '.children'));

            },
        },
        created() {
            this.$store.getters.areas.then(areas => this.areas = _.cloneDeep(areas));
        },
        mounted() {
            // !!!! HACK 代替 ElCascader 的筛选方法
            // TODO 有个小问题，如果是跨地方搜索，对应字段不会高亮，比如说"深圳南山"，就不会高亮
            const areaRef = this.$refs.area, that = this;
            areaRef.debouncedInputChange = _.debounce(function (value) {
                this.menu.options = [{
                    __IS__FLAT__OPTIONS: true,
                    label: this.t('el.cascader.loading'),
                    value: '',
                    disabled: true
                }];

                if (!this.menuVisible) return;

                if (!value) {
                    this.menu.options = this.options;
                    this.$nextTick(this.updatePopper);
                    return;
                }

                let filteredFlatOptions = [];
                this.$store.getters.searchAreas(value, null, that.realLevel)
                    .then(areas => that.reformatAreasPromise(areas)).then(areas => {
                    if (!areas.length) {
                        filteredFlatOptions = [{
                            __IS__FLAT__OPTIONS: true,
                            label: this.t('el.cascader.noMatch'),
                            value: '',
                            disabled: true
                        }];
                        return;
                    }

                    filteredFlatOptions = areas.map(area => {
                        const parentAreas = [];
                        for (let parentArea = area; parentArea; parentArea = parentArea.parent) {
                            parentAreas.unshift(parentArea);
                        }

                        return {
                            __IS__FLAT__OPTIONS: true,
                            value: parentAreas.map(item => item[this.valueKey]),
                            label: this.renderFilteredOptionLabel(value, parentAreas),
                            disabled: false,
                        };
                    });
                }).catch(err => {
                    filteredFlatOptions = [{
                        __IS__FLAT__OPTIONS: true,
                        label: '搜索暂不可用',
                        value: '',
                        disabled: true
                    }];
                }).then(() => {
                    this.menu.options = filteredFlatOptions;
                    this.$nextTick(this.updatePopper);
                });
            }.bind(areaRef), this.debounce);
            // !!!! HACK END 代替 ElCascader 的筛选方法
        },
        watch: {
            value: {
                immediate: true,
                handler(areaCode) {
                    if (_.isArray(areaCode)) {
                        areaCode = _.max(areaCode);
                    }

                    if (!areaCode) {
                        this.elValues = [];
                        return;
                    }

                    this.$store.getters.getArea(areaCode).then(area => {
                        const elValues = [];
                        for (let nextArea = area; nextArea; nextArea = nextArea.parent) {
                            elValues.unshift(nextArea.code);
                        }

                        // 如果选择的是最后一级，并且父级不存在子列表，则加载一下子列表，最后再将赋值
                        if (area.isLast && _.size(area.parent.children) === 0) {
                            this.$store.getters.fetchTownAreas(area.parentCode).then(townAreas => {
                                this.areas[area.parentCode].children = townAreas;
                                this.elValues = elValues;
                            })
                        } else {
                            this.elValues = elValues;
                        }
                    });
                },
            },
        },
        methods: {
            onActiveItemChange(values) {
                const lastIndex = values.length - 1;
                const parentCode = values[lastIndex];
                const parentArea = this.areas[parentCode];

                // !!!! HACK START 解决无法点击省市区的问题
                // TODO 此处可优化，目前处理方式性能问题影响不大
                if (this.selectAnyLevel) {
                    const areaCascader = this.$refs.area.menu;
                    this.$nextTick(() => {
                        const element = areaCascader.$el.querySelectorAll('.el-cascader-menu__item.is-active')[lastIndex];
                        element.onclick = (e) => {
                            areaCascader.select({
                                value: parentCode,
                                label: parentArea.name,
                            }, lastIndex);
                        }
                    });
                }
                // !!!! HACK END

                // 如果存在子级，并且没有子级数据，则获取子级数据
                if (parentArea.children && parentArea.children.length === 0) {
                    this.$store.getters.fetchTownAreas(parentCode).then(townAreas => parentArea.children = townAreas);
                }

            },
            onChange(values) {
                this.$emit('change', _.last(values));
            },
            reformatAreasPromise(areas) {
                if (!areas || !areas.length) {
                    return Promise.resolve([]);
                }

                return (new Promise((resolve, reject) => {
                    const [validAreas, otherAreas] = _.partition(areas, area => area.isLast || area.level >= this.realLevel);

                    // 超过20个有效地址，直接返回
                    if (validAreas.length >= 20) {
                        resolve(validAreas);
                        return;
                    }

                    // 过滤掉不符合规则的地址，最多加载3个children
                    const parentLevel = this.realLevel - 1;
                    const loadChildrenAreas = _.filter(otherAreas, area => {
                        return this.selectAnyLevel ? area.level <= parentLevel : area.level === parentLevel;
                    }).slice(0, 3);

                    // 不需要加载children，直接返回成功
                    if (loadChildrenAreas.length <= 0) {
                        resolve(validAreas);
                        return;
                    }

                    // 开始加载children
                    const getAreaChildrenPromise = this.$store.getters.getAreaChildren;
                    const promises = _.map(loadChildrenAreas, area => getAreaChildrenPromise(area.code));

                    Promise.all(promises).then(allChildren => {
                        const extraAreas = [];
                        allChildren.forEach((children, index) => {
                            if (this.selectAnyLevel) {
                                extraAreas.push(loadChildrenAreas[index]);
                            }
                            extraAreas.push(...children);
                        });

                        resolve(_.uniqBy(validAreas.concat(extraAreas), 'code'));
                    });
                }));
            }
        },
    };
</script>
<style scoped>
</style>
