import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
         // hideInMenu: true,
          title: '基金列表',
         // notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/funds-view/list.vue')//('@/view/dashboard/WorkPlatform')
      }
    ]
  },

  {
    path: '/fund',
    name: 'fund',
    meta: {
      icon: 'logo-buffer',
      title: '基金评测'
    },
    component: Main,
    children: [


	    {
		    path: '/list',
		    name: 'list',
		    meta: {
			    title: '基金列表',
			    icon: 'md-home'
		    },
		    component: () => import('@/view/funds-list/fundList.vue')
	    },
	    {
		    path: '/listold',
		    name: 'listold',
		    meta: {
			    title: '基金列表(旧)',
			    icon: 'md-home'
		    },
		    component: () => import('@/view/funds-view/list.vue')
	    },
	    {
		    path: 'content',
		    name: 'content',
		    meta: {
			    // hideInMenu: true
			    icon: 'ios-infinite',
			    title: '基金详情'

		    },
		    component: () => import('@/view/funds-view/content.vue')
	    },

	 /*   {
		    path: 'navandbench',
		    name: 'navandbench',
		    meta: {
			    icon: 'ios-infinite',
			    title: '历史净值'
		    },
		    component: () => import('@/view/funds-view/NavAndBench.vue')
	    },
      {
        path: 'rollingreturnsandvolatility',
        name: 'rollingreturnsandvolatility',
        meta: {
          icon: 'ios-infinite',
          title: '滚动收益与波动表现'
        },
        component: () => import('@/view/funds-view/RollingReturnsAndVolatility.vue')
      },
	    {
		    path: 'fulltimeIndustryAllocation',
		    name: 'fulltimeIndustryAllocation',
		    meta: {
			    icon: 'ios-infinite',
			    title: '全时段行业配置'
		    },
		    component: () => import('@/view/funds-view/FulltimeIndustryAllocation.vue')
	    },
	    {
		    path: 'RollIndustryAllocation',
		    name: 'RollIndustryAllocation',
		    meta: {
			    icon: 'ios-infinite',
			    title: '滚动行业配置'
		    },
		    component: () => import('@/view/funds-view/RollIndustryAllocation.vue')
	    },
	    {
		    path: 'RelativeDatumExcessIndustryAllocation',
		    name: 'RelativeDatumExcessIndustryAllocation',
		    meta: {
			    icon: 'ios-infinite',
			    title: '相对基准超额行业配置'
		    },
		    component: () => import('@/view/funds-view/RelativeDatumExcessIndustryAllocation.vue')
	    },

	    {
		    path: 'factor_config',
		    name: 'factor_config',
		    meta: {
			    icon: 'ios-infinite',
			    title: '风格因子配置能力'
		    },
		    component: () => import('@/view/funds-view/styleFactorMonthly.vue')
	    },
	    {
		    path: 'factor_effective',
		    name: 'factor_effective',
		    meta: {
			    icon: 'ios-infinite',
			    title: '风格因子配置有效性'
		    },
		    component: () => import('@/view/funds-view/styleFactorEffective.vue')
	    },*/
	    //
      ]

  },
  {
    path: '/UserManagement',
    name: 'UserManagement',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'group-user-management',
        name: 'group-user-management',
        meta: {
          icon: 'logo-buffer',
          title: '机构用户管理'
        },
        component :  () => import('@/view/user-management/groupUserManagement.vue')
      },
      {
        path: 'role-permission-management',
        name: 'role--permission-management',
        meta: {
          icon: 'logo-buffer',
          title: '角色权限管理'
        },
        component :  () => import('@/view/user-management/RolePermission.vue')
      },
      {
        path: '/RoleUser',
        name: 'RoleUser',
        meta: {
          icon: 'logo-buffer',
          title: '用户赋权管理'
        },
        component: () => import('@/view/user-management/RoleUser.vue')
      },
      {
        path: '/UserPermission',
        name: 'UserPermission',
        meta: {
          icon: 'logo-buffer',
          title: '查看用户权限'
        },
        component: () => import('@/view/user-management/UserPermission.vue')
      }
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }

]
