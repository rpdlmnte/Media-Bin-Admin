<template>
  <div>
    <el-icon v-if="isCollapse" @click="isCollapse = false">
      <More />
    </el-icon>
    <e-icon v-if="isCollapse" @click="isCollapse = false">
      <Expand />
    </e-icon>
    <el-icon v-else @click="isCollapse = true">
      <Expand />
    </el-icon>
  </div>
  <div>
    <el-menu
      class="sideMenu"
      :collapse="isCollapse"
      active-text-color="#409EFF"
      :default-active="activeLink"
      text-color="#909399"
      background-color="#FFFFFF"
      :router="true"
    >
      <el-menu-item class="logo">
        <img
          alt="Skanlog logo"
          id="skanlogLogo"
          src="@/assets/Images/SkanlogLogoHD.png"
        />
      </el-menu-item>

      <el-menu-item index="/File">
        <router-link to="/File">
          <el-icon><Files /></el-icon>
          <span>File</span>
        </router-link>
      </el-menu-item>

      <el-menu-item index="/AppPermission">
        <router-link to="/AppPermission">
          <el-icon><Menu /></el-icon>
          <span>App</span>
        </router-link>
      </el-menu-item>

      <el-menu-item index="/User">
        <router-link to="/User">
          <el-icon><UserFilled /></el-icon>
          <span>User</span>
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Menu, Files, UserFilled, Expand } from "@element-plus/icons";

export default defineComponent({
  name: "SideMenu",
  components: {
    Menu,
    Files,
    UserFilled,
    Expand,
  },
  mounted() {
    this.activeLink = this.$route.path;
    this.baseUrl = window.location.origin;
  },
  watch: {
    $route(newVal) {
      this.activeLink = newVal.path;
    },
  },
  data() {
    return {
      activeLink: "",
      baseUrl: "",
      // logoUrl: 'https://i.ibb.co/4Y8FLqB/Skanlog-Logo-HD.png',
      logoUrl: "@/assets/Images/logo.png",
      fitType: "scale-down",
    };
  },
  setup() {
    const isCollapse = ref(false);

    return { isCollapse };
  },
});
</script>
<style lang="scss" scoped>
.sideMenu {
  // width: 15rem;
  height: 98vh;
  background-color: #ffffff;
  border-width: 0 0 0 0;
  border-style: solid;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  min-width: 4em;
  overflow: hidden;
  transition: 0.2s ease-in-out;
}
.logo {
  max-height: 25px;
  margin-top: 1em;
  img {
    width: 5rem;
  }
}
a {
  color: inherit;
  text-decoration: none !important;
}
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 200px;
// }
</style>
