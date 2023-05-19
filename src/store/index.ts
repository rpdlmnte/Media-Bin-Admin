import api from "@/services/apiService";
import { createStore } from "vuex";
import oidcStore from "./oidc";
import appStoreStore from "./appStore";
import { ElMessage } from "element-plus";

const state = () => ({
  loading: false,
  errorLoading: false,
  user: [],
  users: [],
  usersList: [],
});
const mutations = {
  SET_USER_ROLE(state: any, data: any) {
    state.user = data;
  },
};
const actions = {
  async getUserRole({ commit }: any, payload: any): Promise<void> {
    console.log("payload", payload);

    await api
      .get(`AdminUserManagement/${payload}`)
      .then((response) => {
        // this.userRole = response.data;
        console.log("Login Role Retrieved: ", response.data);
        console.log(response.data);
        commit("SET_USER_ROLE", response.data);
      })
      .catch(() => {
        ElMessage.error("user no permission");
      });
  },
};
const getters = {
  returnUserRole(state: any) {
    return state.user;
  },
};

export default createStore({
  strict: process.env.NODE_ENV !== "production",
  state,
  mutations,
  actions,
  getters,
  modules: {
    appStoreStore,
    oidcStore,
  },
});
