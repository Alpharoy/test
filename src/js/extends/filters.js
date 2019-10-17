import {DateTime} from 'luxon';

/**
 *
 * 转换成DateTime对象
 * @see https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
 * @param {string} value
 * @return {module:luxon.luxon.DateTime}
 * @constructor
 */
function DateTimeFromString(value) {
    return DateTime.fromISO(value);
}

export default {
    /**
     * 日期格式化
     *
     * @param {string} value
     * @return {string}
     */
    qlDateTime(value) {
        if (value) {
            return DateTimeFromString(value).toFormat('yyyy/LL/dd HH:mm:ss');
        }
        return '--';
    },

    /**
     * 日期格式化
     *
     * @param {string} value
     * @returns {string}
     */
    qlDate(value) {
        if (value) {
            return DateTimeFromString(value).toFormat('yyyy/LL/dd');
        }
        return '--';
    },
};