import {
  fetchPost
} from "@/libs/http"
const user = {
  state: {
    userId: "",
    userName: '',
    userRole: [], //用户角色
    userOrg: [], //用户组织
    btnAuth: '', //按钮权限
  },
  mutations: {
    SET_BTNAUTH: (state, btnAuth) => { //按钮权限
      state.btnAuth = btnAuth
    },
    SET_ID: (state, userId) => { //用户ID
      state.userId = userId
    },
    SET_NAME: (state, userName) => { //用户名
      state.userName = userName
    },
    SET_ROLES: (state, userRole) => { //用户角色
      state.userRole = userRole
    },
    SET_ORG: (state, userOrg) => { //用户组织
      state.userOrg = userOrg
    },
  },
  actions: {
    // GetUserInfo({ //获取用户信息
    //   commit,
    //   state
    // }) {
    //   return new Promise((resolve, reject) => {
    //     let b = new base64();
    //     let username = name;
    //     let password = pass;
    //     password = password ? password : '';
    //     fetchPost("login", {
    //       username: username,
    //       password: b.encode(password + '#THT#')
    //     }).then(res => {
    //       commit('SET_BTNAUTH', res.info.auth);
    //       resolve(true);
    //     })
    //   })
    // },
  }
}
export default user
