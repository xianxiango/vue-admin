<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <el-scrollbar class="sidebar-container" wrapClass="scrollbar-wrapper">
      <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened="true">
        <sidebar-item :routes="routers"></sidebar-item>
      </el-menu>
    </el-scrollbar>

    <div class="main-container">

      <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <breadcrumb class="breadcrumb-container"></breadcrumb>

        <div class="right-menu">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ username }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="isResetPassword = true">修改密码</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="exit">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </el-menu>

      <tags-view></tags-view>
      <section class="app-main">
        <!-- <transition name="fade" mode="out-in">
          <keep-alive :exclude="noCachedViews">
            <router-view></router-view>
          </keep-alive>
        </transition> -->
        <router-view></router-view>
      </section>
    </div>
    <!-- 修改密码  -->
    <el-dialog title="修改密码" :visible.sync="isResetPassword" width="40%" class="reset-password" center>
      <el-form>
        <el-form-item label="原密码" label-width="120px">
          <el-input v-model="oldPsw" placeholder="请输入原密码..." clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px">
          <el-input v-model="newPsw" placeholder="请输入新密码..." clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isResetPassword = false">取 消</el-button>
        <el-button type="primary" @click="submitResetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5'
import Cookies from 'js-cookie'
import { fetchData } from '@/api'
import ResizeMixin from '@/mixins/resize'
import TagsView from '@/components/TagsView'
import Hamburger from "@/components/Hamburger"
import Breadcrumb from "@/components/Breadcrumb"
import SidebarItem from '@/components/Sidebar'
export default {
  name: 'Main',
  components: {
    TagsView,
    Hamburger,
    Breadcrumb,
    SidebarItem
  },
  mixins: [ResizeMixin],
  data() {
    return {
      oldPsw: '',
      newPsw: '',
      isResetPassword: false,
      username: Cookies.get('username') ? Cookies.get('username') : 'null'
    }
  },
  computed: {
    routers() {
      return this.$store.state.routers
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    sidebar() {
      return this.$store.state.sidebar
    },
    device() {
      return this.$store.state.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    noCachedViews() {
      return this.$store.state.noCachedViews
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    // 切换侧边栏
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // 退出登录
    exit() {
      fetchData('adminLogout').then(user => {
        if (user) {
          Cookies.remove('auth')
          window.location.href = `${window.location.origin}/login`
        }
      })
    },
    // 修改密码
    submitResetPassword() {
      if (!this.oldPsw || !this.newPsw) {
        this.$message.info('请输入密码')
        return false
      }
      const auth = Cookies.get('auth')
      if (!auth) {
        this.$message.info('账号异常、请重新登录')
        return false
      }
      const temp = auth.split('|')
      fetchData('adminResetPassword', {
        id: temp[0],
        old_psw: md5(this.oldPsw),
        new_psw: md5(this.newPsw)
      }).then(data => {
        if (data) {
          Cookies.remove('auth')
          Cookies.remove('password')
          window.location.href = `${window.location.origin}/login`
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    padding-right: 20px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      vertical-align: middle;
    }
    .screenfull {
      height: 20px;
    }
    .exit {
      display: inline-block;
      cursor: pointer;
      fill: #5a5e66;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin: 0 10px;
    }
  }
}
</style>
