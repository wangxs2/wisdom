
console.log(process.env.NODE_ENV)

const permission = {
  state: {
    menuData: [], //菜单数据
    // routers: constantRouterMap, //路由表
    addRouters: [], //动态路由表
  },
  mutations: {
    SET_MENU: (state, menuData) => { //菜单
      state.menuData = menuData
    },
    SET_ROUTERS: (state, routers) => { //设置路由
      state.addRouters = routers
      // state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
  }
}

export default permission