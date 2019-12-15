import axios from 'axios';
import {DateTime} from 'luxon';
import config from '../../config';

const areaApiBaseURI = config.API_AREA_BASE_URI + '/api/v1/';

const areaChina = {code: '1', name: '全国', parentCode: null, level: 1, isLast: false};
const fetchTownAreasPromises = {};
const cachedTownAreas = {};

/**
 * 获取地址库数据源
 * @type {Promise<any>}
 */
const fetchAreasPromise = new Promise((resolve, reject) => {
    axios.get(areaApiBaseURI + 'config').then(response => {
        const serverUpdateTime = _.get(response, 'data.update_time');
        const localUpdateTime = localStorage.areasUpdateTime;

        // 如果本地时间与服务器时间一致，则读取缓存
        if (serverUpdateTime && localUpdateTime === serverUpdateTime) {
            try {
                return resolve(JSON.parse(localStorage.areas));
            } catch (e) {
                console.warn('缓存地址库加载失败', e);
            }
        }

        // 读取服务器数据
        axios.get(areaApiBaseURI + 'areas', {params: {level: 4, compress: 1, with_deleted: 0, with_oversea: 0}})
            .then(response => {
                const compressedAreas = response.data;
                // 保存到缓存
                localStorage.areas = JSON.stringify(compressedAreas);
                localStorage.areasUpdateTime = serverUpdateTime;

                resolve(compressedAreas);
            }).catch(err => reject('地址库加载失败'));
    }).catch(err => {
        // 尝试从缓存加载
        try {
            resolve(JSON.parse(localStorage.areas));
        } catch (e) {
            reject('地址库信息获取失败');
        }
    });
});

/**
 * 获取单个地址信息
 *
 * @param {string} areaCode
 * @return {Promise<any>}
 */
const fetchAreaPromise = areaCode => new Promise((resolve, reject) => {
    axios.get(areaApiBaseURI + 'areas/' + areaCode)
        .then(response => {
            const areaData = response.data;
            resolve({
                code: areaData.code,
                name: areaData.name,
                parentCode: areaData.parent_code,
                level: areaData.level,
                isLast: areaData.is_last,
            });
        })
        .catch(err => {
            reject(new Error('地址信息获取失败'));
        });
});

/**
 * 通过父code获取街道地址列表
 *
 * @param {string} parentCode
 * @return {Promise<any>}
 */
const fetchTownAreasPromise = parentCode => {
    const oldPromise = fetchTownAreasPromises[parentCode];
    if (oldPromise) {
        return oldPromise;
    }

    return fetchTownAreasPromises[parentCode] = new Promise((resolve, reject) => {
        axios.get(areaApiBaseURI + 'areas', {params: {parent_code: parentCode, level: 5, compress: 1}})
            .then(response => {
                areasPromise.then(areas => {
                    const parentArea = areas[parentCode];
                    resolve(response.data.map(areaData => {
                        const [code, name, parentCode, level, isLast] = areaData;
                        return cachedTownAreas[code] = {code, name, parentCode, level, isLast, parent: parentArea};
                    }));

                }).catch(err => reject(err));
            })
            .catch(err => reject(new Error('获取镇/街道列表失败')));
    });
};

/**
 * 根据名称搜索地址
 *
 * @param {string} name
 * @param {integer|null} minLevel
 * @param {integer|null} maxLevel
 * @return {Promise<any>}
 */
const searchAreasPromise = (name, minLevel = null, maxLevel = null) => {
    return new Promise((resolve, reject) => {
        axios.get(areaApiBaseURI + 'areas/search', {
            params: {
                name: name,
                min_level: minLevel,
                max_level: maxLevel,
                with_deleted: 0,
                with_oversea: 0
            }
        })
            .then(response => {
                areasPromise.then(areas => {
                    resolve(response.data.map(areaData => {
                        // 尝试解析是否已有数据
                        const areaCode = areaData['code'], area = areas[areaCode];
                        if (area) {
                            return area;
                        }

                        // 没有则解析父类，生成一个新的area
                        const parentCode = areaData['parent_code'], parentArea = areas[parentCode];
                        return {
                            code: areaData['code'],
                            name: areaData['name'],
                            parentCode: parentCode,
                            level: areaData['level'],
                            isLast: areaData['is_last'],
                            parent: parentArea,
                        };
                    }));

                }).catch(err => reject(err));
            })
            .catch(err => reject(new Error('地址搜索失败')));
    });
};

/**
 * 地址库初始化
 * @type {Promise<any>}
 */
const areasPromise = new Promise((resolve, reject) => {
    fetchAreasPromise.then(areas => {
        const parsedAreas = {};
        if(!areas){
            return false;
        }
        areas.forEach(area => {
            const [code, name, parentCode, level, isLast] = area;
            const parsedArea = {code, name, parentCode, level, isLast};
            if (!parsedArea.isLast) {
                parsedArea.children = [];
            }
            // 设置当前区域信息
            _.defaultsDeep(parsedAreas, {
                [code]: parsedArea,
                [parentCode]: {children: []},
            });
            // 设置children和parent字段
            const currentArea = parsedAreas[code], parentArea = parsedAreas[parentCode];
            currentArea.parent = currentArea.level > 2 ? parentArea : null;
            parentArea.children.push(currentArea);
        });

        resolve(parsedAreas);
    }).catch(err => reject(err));
});

/**
 * 获取地址库树结构
 * @type {Promise<any>}
 */
const areaTreePromise = new Promise((resolve, reject) => {
    areasPromise.then(areas => resolve(areas[areaChina.code].children))
        .catch(err => reject(err));
});


export default {
    state: {
        china: areaChina,
    },
    mutations: {},
    getters: {
        /**
         * 获取地址库对象 {areaCode1: areaObject1, areaCode2: areaObject2}
         * areaObject = {code: areaCode1, isLast: 0, level: 2, name: "北京", parent: areaObject, parentCode: "1", children: [areaObject1, areaObject2 ...]}
         *
         * @return {Promise<any>}
         */
        areas: () => areasPromise,

        /**
         * 根据名称搜索地址
         *
         * @param state
         * @return {function(*=, *=, *=): Promise<any>}
         */
        searchAreas: (state) => (name, minLevel = null, maxLevel = null) => searchAreasPromise(name, minLevel, maxLevel),

        /**
         * 获取省份地址数组 [areaObject1, areaObject2 ...] areaObject同上
         *
         * @return {Promise<any>}
         */
        areaTree: () => areaTreePromise,

        /**
         * 获取街道地址列表（4级）
         *
         * @return {function(*=): Promise<any>}
         */
        fetchTownAreas: (state) => areaCode => fetchTownAreasPromise(areaCode),

        /**
         * 获取单个地址信息
         *
         * @return {function(*): Promise<any>}
         */
        getArea: (state, getters) => areaCode => {
            if (!areaCode) {
                return Promise.reject(new Error('地址编码不能为空'));
            }

            const isTownCode = getters.isTownCode(areaCode);
            return new Promise((resolve, reject) => {
                // 如果不是镇或街道的地址，可以直接返回格式化好的地址信息
                if (!isTownCode) {
                    areasPromise.then(areas => resolve(areas[areaCode]))
                        .catch(err => reject(err));
                    return;
                }

                // 尝试从已缓存的镇/街道列表中读取
                const cacheTownArea = cachedTownAreas[areaCode];
                if (cacheTownArea) {
                    resolve(cacheTownArea);
                    return;
                }

                // 没有则从线上获取
                fetchAreaPromise(areaCode).then(area => {
                    areasPromise.then(areas => {
                        area.parent = areas[area.parentCode];
                        cachedTownAreas[areaCode] = area;
                        resolve(area);
                    }).catch(err => reject(err));
                }).catch(err => reject(err))
            });
        },

        getAreaChildren: (state, getters) => areaCode => {
            if (!areaCode) {
                return Promise.reject(new Error('地址编码不能为空'));
            }

            if (getters.isTownCode(areaCode)) {
                return Promise.resolve([]);
            }

            return getters.getArea(areaCode).then(area => {
                if (area.isLast) {
                    return Promise.resolve([]);
                }

                if (area.level === 4) {
                    return fetchTownAreasPromise(area.code);
                } else {
                    return Promise.resolve(area.children);
                }
            });
        },

        /**
         * 获取地址上级所有信息，其余信息用undefined填充
         *
         * @param state
         * @param getters
         * @return {function(*=, *=): Promise<any>}
         */
        getAreaFamily: (state, getters) => (areaCode, useFriendlyKey = true) => {
            return new Promise((resolve, reject) => {
                getters.getArea(areaCode).then(area => {
                    const areaFamily = {};
                    for (let tmpArea = area; tmpArea; tmpArea = tmpArea.parent) {
                        areaFamily[tmpArea.level] = tmpArea;
                    }

                    if (!useFriendlyKey) {
                        resolve(areaFamily);
                        return;
                    }

                    resolve({
                        province: areaFamily[2],
                        city: areaFamily[3],
                        district: areaFamily[4],
                        town: areaFamily[5],
                    });
                }).catch(err => reject(err))
            });

        },

        /**
         * 判断是否街道/镇的地址code
         *
         * @param state
         * @return {function(*): boolean}
         */
        isTownCode: (state) => areaCode => {
            return areaCode.length === 9
        }
    },
};
