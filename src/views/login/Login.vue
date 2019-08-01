<template>
  <div class="login">
    <div class="login-con">
      <el-card>
        <div slot="header" class="login-header">
          <h3>{{hostConfig.title}}</h3>
        </div>
        <el-form class="login-form" label-width="0">
          <el-form-item class="login-user">
            <el-input size="small" v-model="username" placeholder="请输入用户名...">
              <svg-icon slot="prefix" icon-class="user" />
            </el-input>
          </el-form-item>
          <el-form-item class="login-password">
            <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model="password" placeholder="请输入密码...">
              <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
              <svg-icon slot="prefix" icon-class="password" />
            </el-input>
          </el-form-item>
          <el-checkbox v-model="checked">记住账号</el-checkbox>
          <el-form-item class="login-button">
            <el-button type="primary" size="small" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

  </div>
</template>

<script>
import md5 from 'md5'
import { fetchData } from '@/api'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      checked: false,
      loading: false,
      passwordType: 'password',
      username: Cookies.get('username') ? Cookies.get('username') : '',
      password: Cookies.get('password') ? Cookies.get('password') : ''
    }
  },
  computed: {
    hostConfig: function () {
      return this.$store.state.hostConfig
    }
  },
  methods: {
    // 显示密码
    showPassword() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    // 登录
    handleLogin() {
      if (!this.username || !this.password) {
        ELEMENT.Message.error('请输入用户名或密码')
        return false
      }
      this.loading = true
      fetchData('adminLogin', {
        username: this.username,
        password: md5(this.password),
        remember: this.checked ? 1 : 0
      }).then(data => {
        if (!data) {
          this.loading = false
          return false
        }
        Cookies.set('username', this.username, { expires: 30 })
        // Cookies.set('password', this.password, { expires: 30 })
        this.$store.dispatch('fetchAvailable').then(() => {
          window.location.href = `${window.location.origin}/`
        })
      })
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  // background-image: url('/static/images/login_bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  &-con {
    position: absolute;
    right: 30%;
    top: 30%;
    width: 320px;
  }
  &-user {
    .el-input__prefix {
      font-size: 18px;
      top: -1px;
    }
  }
  &-password {
    margin-bottom: 10px;
    .el-input__prefix {
      left: 7px;
    }
  }
  &-button {
    margin-top: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>

