<template>
  <div class="app-wrapper" :class="classObj">
    <div class="header" style="height:100px"></div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <!-- <el-scrollbar class="sidebar-container" wrapClass="scrollbar-wrapper"> -->
    <el-menu
      mode="horizontal"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
      v-bind:class="{ 'topMenu': istopMenu}"
    >
      <sidebar-item :routes="routers"></sidebar-item>
    </el-menu>
    <!-- </el-scrollbar> -->
    <div class="banner-box">
      <!-- <el-carousel :interval="4000" type="card" height="450px">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>-->
      <el-carousel :interval="5000" arrow="always" height="450px">
        <el-carousel-item v-for="item in demoData" :key="item.title">
          <router-link to="student" :key="item.title">
            <img :src="item.img" style="width:100%;height:100%" />
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main-container">
      <!-- <el-menu class="navbar" mode="horizontal">
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

      </el-menu>-->

      <!-- <tags-view></tags-view> -->
      <section class="app-main">
        <!-- <transition name="fade" mode="out-in">
          <keep-alive :exclude="noCachedViews">
            <router-view></router-view>
          </keep-alive>
        </transition>-->

        <router-view></router-view>
      </section>
    </div>
    <el-backtop target=".app" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >UP</div>
    </el-backtop>

    <div class="footer margin-top">
      <div class="footer-box">
        <div class="footer-content"></div>
        <div class="footer-content">
          <div>联系人：李小姐</div>
          <div>咨询热线：020-29807360 13719430808 QQ:269952924 微信：eda_lee</div>
          <div>地址：广州市海珠区艺苑南路13号布衣港电商产业园8栋202（客村地铁D出口） 上海网站建设</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import Cookies from "js-cookie";
import { fetchData } from "@/api";
import ResizeMixin from "@/mixins/resize";
// import TagsView from "@/components/TagsView";
// import Hamburger from "@/components/Hamburger";
// import Breadcrumb from "@/components/Breadcrumb";
import SidebarItem from "@/components/Sidebar";
export default {
  name: "Main",
  components: {
    // TagsView,
    // Hamburger,
    // Breadcrumb,
    SidebarItem
  },
  mixins: [ResizeMixin],
  data() {
    return {
      oldPsw: "",
      newPsw: "",
      isResetPassword: false,
      istopMenu: false,
      demoData: [
        {
          img:
            "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
          title: "图片1"
        },
        {
          img:
            "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          title: "图片2"
        },
        {
          img:
            "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
          title: "图片3"
        },
        {
          img:
            "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
          title: "图片4"
        },
        {
          img:
            "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
          title: "图片5"
        },
        {
          img:
            "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
          title: "图片6"
        }
      ]
    };
  },
  computed: {
    routers() {
      return this.$store.state.routers;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    sidebar() {
      return this.$store.state.sidebar;
    },
    device() {
      return this.$store.state.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
    noCachedViews() {
      return this.$store.state.noCachedViews;
    }
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);

      if (scrollTop > 100) {
        this.istopMenu = true;
      } else {
        this.istopMenu = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  .footer-box {
    display: flex;
    width: 1000px;
    margin: 0 auto;
  }
}
.footer-content {
  div {
    text-align: right;
  }
  padding-top: 80px;
  flex: 1;
  color: rgb(191, 203, 217);
  font-size: 12px;
  line-height: 1.8;
}
.topMenu {
  position: fixed;
  width: 100%;
  z-index: 9999;
  top: 0;
}
</style>
