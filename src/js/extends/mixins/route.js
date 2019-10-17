const callUrInitData = that => {
    if (_.isFunction(that.urInitData)) {
        that.urInitData();
    }
};

const callUrFetchData = that => {
    if (_.isFunction(that.urFetchData)) {
        that.urFetchData();
    }
};

export default {
    beforeRouteUpdate(to, from, next) {
        next();
        callUrFetchData(this);
    },

    activated() {
        callUrInitData(this);
        callUrFetchData(this);
    },
}