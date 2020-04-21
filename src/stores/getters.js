const getters = {
  docHeight: state => state.app.docHeight,
  menuFlag: state => state.app.menuFlag,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  userRole: state => state.user.userRole,
  userOrg: state => state.user.userOrg,
  btnAuth: state => state.user.btnAuth,
  menuData: state => state.permission.menuData,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters