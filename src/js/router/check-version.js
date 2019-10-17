import axios from 'axios';

let manifest = null;

export default function (router) {
    router.beforeEach((to, from, next) => {
        axios.get('/mix-manifest.json?_=' + Date.now()).then(response => {
            if (manifest === null) {
                manifest = response.data;
            } else if (!_.isEqual(manifest, response.data)) {
                alert('有新版本发布，请刷新浏览器');
                window.location.reload(true);
                return;
            }
            next();
        }).catch(err => {
            console.error(err);
            next();
        });
    });

    return router;
}