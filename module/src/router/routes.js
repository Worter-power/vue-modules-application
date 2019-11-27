const Index  = () => import('../components/Index.vue');
const Hello = () => import( '../components/Hello.vue');
const List = () => import( '../components/List.vue');
const viewport = () => import( '../components/page-viewport/main.vue');
export default [
    { 
        path: '/ph', 
        name:'', 
        component: {
            template: '<div class="sy-app-container"><router-view></router-view></div>'
        },
        children: [
            { path: 'index', component: Index },
            { path: 'home', component: Hello },
            { path: 'my', component: List },
            { path: 'viewport', component: viewport },
            {
                path: '/',
                redirect: '/ph/viewport',
                meta: {
                    keepAlive: false
                }
            }
        ]
    }
]