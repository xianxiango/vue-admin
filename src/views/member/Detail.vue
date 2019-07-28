<template>
  <div class="public-view user-detail">
    <el-row :gutter="40">
      <el-col :span="6">
        <el-card class="box-card" v-if="userInfo">
          <div slot="header" class="info-header">
            <strong>{{userInfo.Email}}</strong>
            <el-tag size="mini" v-if="userInfo.Block" type="danger">已冻结</el-tag>
          </div>
          <div class="info-body">
            <p
              v-if="userInfo.Risk==1"
              style="color:#F56C6C;font-weight: bold;font-size:18px;margin-bottom: 10px;"
            >风险账户！</p>
            <p>Uid：{{userInfo.Uid}}</p>
            <p>姓名：{{userInfo.UserName==""?"未认证":userInfo.UserName}}</p>
            <p>类型：{{userInfo.userType}}</p>
            <p>Vip：{{userInfo.vip}}</p>
            <p>合伙人类型：{{userInfo.AgentModeType}}</p>
            <p>邮箱：{{userInfo.Email}}</p>
            <p>手机：{{ userInfo.Mobile ? userInfo.Mobile.substring(6) : '--'}}</p>
            <p>谷歌：{{ userInfo.GgAuth ? '已绑定' : '未绑定'}}</p>
            <p>创建时间：{{userInfo.CreateTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>创建IP：{{userInfo.CreateIP}}</p>
            <p>最近登录时间：{{userInfo.LastLoginTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>最近登录IP：{{userInfo.LastLoginIP}}</p>
            <p>备注：{{userInfo.Remarks}}</p>
            <p v-if="userInfo.Block">冻结原因：{{userInfo.BlockReason}}</p>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="info-header">
            <strong>系统设置</strong>
          </div>
          <div class="info-item">
            <el-button icon="el-icon-edit" @click="setPermission">权限设置</el-button>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="info-header">
            <strong>安全设置</strong>
          </div>
          <div class="info-item">
            <el-button icon="el-icon-edit" @click="changePassword">修改密码</el-button>
          </div>
          <div class="info-item">
            <el-button icon="el-icon-remove-outline" type="primary" @click="accountUnbind">账号解绑</el-button>
          </div>
          <div class="info-item">
            <el-button icon="el-icon-circle-plus-outline" type="success" @click="accountWallet">账号加币</el-button>
          </div>
          <div class="info-item">
            <el-button icon="el-icon-time" type="info" @click="changeUserType">账号类型</el-button>
          </div>
          <div class="info-item">
            <el-button
              icon="el-icon-circle-close-outline"
              type="warning"
              @click="changeAgentType"
            >合伙人类型</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card class="asset-card">
          <h4>个人数据统计</h4>
          <div class="user-table">
            <el-table :data="DyTdlist2" border>
              <el-table-column prop="Currency" label="币种" :formatter="formatterC" fixed="left"></el-table-column>
              <el-table-column prop="Balance" label="余额"></el-table-column>
              <el-table-column prop="Usable" label="可用" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Lock" label="冻结" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Pay" label="充值" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Withdraw" label="提现" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Commission" label="返佣" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Other" label="其他" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Activity" label="活动奖励" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Exchange" label="兑换" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Cfdrollin" label="CFD转入" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Cfdrollout" label="CFD转出" :formatter="formatter0"></el-table-column>
              <el-table-column prop="State" label="状态" :formatter="formatter0"></el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="asset-card" style="margin-top: 40px;">
          <h4>币币账户</h4>
          <div class="user-table">
            <el-table :data="DySpotlist" border>
              <el-table-column prop="Currency" label="币种" :formatter="formatterC" fixed="left"></el-table-column>
              <el-table-column prop="Balance" label="余额" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Usable" label="可用" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Lock" label="冻结" :formatter="formatter0"></el-table-column>
              <el-table-column prop="In" label="转入" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Out" label="转出" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Buy" label="买入TD花费" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Sell" label="卖出TD获得" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Other" label="其他" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Activity" label="活动发放" :formatter="formatter0"></el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="asset-card" style="margin-top: 40px;">
          <h4>永续合约账户</h4>
          <div class="user-table">
            <el-table :data="DyFutureslist" border>
              <el-table-column prop="Currency" label="币种" :formatter="formatterC" fixed="left"></el-table-column>
              <el-table-column prop="Balance" label="余额" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Usable" label="可用" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Lock" label="冻结" :formatter="formatter0"></el-table-column>
              <el-table-column prop="BuyMarketValue" label="多仓市值" :formatter="formatter0"></el-table-column>
              <el-table-column prop="SellMarketValue" label="空仓市值" :formatter="formatter0"></el-table-column>
              <el-table-column prop="FloatingPL" label="浮盈" :formatter="formatter0"></el-table-column>
              <!-- <el-table-column prop="Fee" label="手续费"></el-table-column> -->
              <el-table-column prop="ProfitLoss" label="盈亏" :formatter="formatter0">
                <template slot-scope="scope">
                  <span
                    style="color:#f25e43"
                    v-if="scope.row.ProfitLoss!=scope.row.ProfitLoss2"
                  >{{scope.row.ProfitLoss}}</span>
                  <span v-if="scope.row.ProfitLoss==scope.row.ProfitLoss2">{{scope.row.ProfitLoss}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="ProfitLoss2" label="盈亏2">
                <template slot-scope="scope">
                  <span
                    style="color:#f25e43"
                    v-if="scope.row.ProfitLoss!=scope.row.ProfitLoss2"
                  >{{scope.row.ProfitLoss2}}</span>
                  <span v-if="scope.row.ProfitLoss==scope.row.ProfitLoss2">{{scope.row.ProfitLoss2}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="System" label="系统调整"></el-table-column> -->
            </el-table>
          </div>
        </el-card>
        <el-card class="asset-card" style="margin-top: 40px;">
          <h4>差价合约账户</h4>
          <div class="user-table">
            <el-table :data="DyCfdlist" border>
              <el-table-column prop="Currency" label="币种" :formatter="formatterC" fixed="left"></el-table-column>
              <el-table-column prop="Balance" label="余额" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Usable" label="可用" :formatter="formatter0"></el-table-column>
              <el-table-column prop="Lock" label="冻结" :formatter="formatter0"></el-table-column>
              <el-table-column prop="BuyMarketValue" label="多仓市值" :formatter="formatter0"></el-table-column>
              <el-table-column prop="SellMarketValue" label="空仓市值" :formatter="formatter0"></el-table-column>
              <el-table-column prop="FloatingPL" label="浮盈" :formatter="formatter0"></el-table-column>
              <!-- <el-table-column prop="Fee" label="手续费"></el-table-column> -->
              <el-table-column prop="ProfitLoss" label="盈亏" :formatter="formatter0"></el-table-column>
              <!-- <el-table-column prop="System" label="系统调整" ></el-table-column> -->
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 账号解绑  -->
    <el-dialog
      title="账号解绑"
      :visible.sync="unbindVisible"
      :close-on-click-modal="false"
      class="user-unbind"
      width="30%"
    >
      <el-radio-group v-model="unbindElement" v-if="userInfo">
        <el-radio label="mobile" border :disabled="!userInfo.Mobile">解绑手机</el-radio>
        <el-radio label="ggauth" border :disabled="!userInfo.GgAuth">解绑谷歌</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unbindVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUnbind">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改账号类型  -->
    <el-dialog
      title="更改账号类型"
      :visible.sync="userTypeVisible"
      :close-on-click-modal="false"
      class="user-unbind"
      width="40%"
    >
      <el-radio-group v-model="selectUserType" v-if="userInfo">
        <el-radio :label="1" border>普通</el-radio>
        <el-radio :label="2" border>内部</el-radio>
        <el-radio :label="3" border>工人</el-radio>
        <el-radio :label="8" border>机构</el-radio>

        <el-input placeholder="请输入内容" v-model="remarks" class="remarksInput">
          <template slot="prepend">备注:</template>
        </el-input>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserType">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改合伙人类型  -->
    <el-dialog
      title="更改合伙人类型"
      :visible.sync="agentTypeVisible"
      :close-on-click-modal="false"
      class="user-unbind"
      width="50%"
    >
      <el-radio-group v-model="selectAgentType" v-if="userInfo">
        <el-radio :label="0" border>普通</el-radio>
        <el-radio :label="1" border>超级合伙人</el-radio>
        <el-radio :label="2" border>合约人下线</el-radio>
        <el-radio :label="3" border>盈链合伙人</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agentTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAgentType">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 账号加币  -->
    <el-dialog
      title="账号加币"
      :visible.sync="isChangeWallet"
      :close-on-click-modal="false"
      class="user-unbind"
      width="40%"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="账号" v-if="this.userInfo">
          <el-input v-model="this.userInfo.Uid" disabled></el-input>
        </el-form-item>
        <el-form-item label="货币类型">
          <el-select v-model="changeCurrency" placeholder="请选择" v-if="hostConfig">
            <el-option v-for="(value, key) in currentCoin" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水类型">
          <el-select v-model="selectAction" placeholder="请选择">
            <el-option v-for="(value, key) in flowWaterList" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="inputCurrency"></el-input>
          <p class="tips" style="color: #ca0c16;">*提示：正数为增加，负数为扣除</p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currencyRemarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isChangeWallet = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeWallet">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="权限设置"
      :visible.sync="PermissionVisible"
      :close-on-click-modal="false"
      class="user-unbind"
      width="50%"
    >
      <h4 style="margin:10px">期货权限</h4>
      <el-checkbox-group v-model="selectFuturesPermission" v-if="userInfo">
        <el-checkbox label="all" border>所有</el-checkbox>
        <el-checkbox label="open" border>开仓</el-checkbox>
        <el-checkbox label="close" border>平仓</el-checkbox>
        <el-checkbox label="cancel" border>撤单</el-checkbox>
        <!-- <el-checkbox label="default" border>默认</el-checkbox> -->
      </el-checkbox-group>
      <h4 style="margin:10px">现货权限</h4>
      <el-checkbox-group v-model="selectSpotPermission" v-if="userInfo">
        <el-checkbox label="all" border>所有</el-checkbox>
        <el-checkbox label="buy" border>买入</el-checkbox>
        <el-checkbox label="sell" border>卖出</el-checkbox>
        <el-checkbox label="cancel" border>撤单</el-checkbox>
        <!-- <el-checkbox label="default" border>默认</el-checkbox> -->
      </el-checkbox-group>
      <h4 style="margin:10px">差价权限</h4>
      <el-checkbox-group v-model="selectCfdPermission" v-if="userInfo">
        <el-checkbox label="all" border>所有</el-checkbox>
        <el-checkbox label="open" border>开仓</el-checkbox>
        <el-checkbox label="close" border>平仓</el-checkbox>
        <el-checkbox label="cancel" border>撤单</el-checkbox>
        <!-- <el-checkbox label="default" border>默认</el-checkbox> -->
      </el-checkbox-group>
      <h4 style="margin:10px">提现权限</h4>
      <el-checkbox-group v-model="selectWalletPermission" v-if="userInfo">
        <el-checkbox label="all" border>所有</el-checkbox>
        <el-checkbox label="deposit" border>充值</el-checkbox>
        <el-checkbox label="withdraw" border>提现</el-checkbox>
        <el-checkbox label="transfer" border>转账</el-checkbox>
        <el-checkbox label="switch" border>划转</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PermissionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "md5";
import { fetchData } from "@/api";
import { uidCode } from "@/utils/uidCode";

import Decimal from "@/utils/decimal";
import { userType, agentModeType, flowWater, orderType } from "@/utils/tdexMap";
export default {
  name: "user-detail",
  data() {
    return {
      currentCoin: {},
      uid: this.$route.query.uid,
      userInfo: null,
      unbindVisible: false,
      unbindElement: "",
      userTypeVisible: false,
      selectUserType: "",
      agentTypeVisible: false,
      selectAgentType: "",
      isChangeWallet: false,
      changeCurrency: "",
      inputCurrency: "",
      PermissionVisible: false,
      selectFuturesPermission: [],
      selectCfdPermission: [],
      selectSpotPermission: [],
      selectWalletPermission: [],
      selectAction: "",
      currencyRemarks: "",
      flowWaterList: flowWater,
      // depositList: [],
      // futuresList: [],
      // statistics: [],
      FutresBtclist: [],
      SpotBtclist: [],
      Tdlist: [],
      DySpotBtclist: [],
      DyTdlist: [],
      DyTdlist2: [],
      DySpotlist: [],
      DyFutureslist: [],
      DyCfdlist: [],
      FutresBtc: {
        BuyTdOrder: 0, //挂单所花BTC
        Fee: 0, //总手续费
        FutresCome: 0, //划入合约账户
        ProfitLoss: 0, //总盈亏
        SpotBack: 0, //划出币币账户
        balance: 0, //合约账号余额
        Margin: 0
      },
      SpotBtc: {
        Activity: 0, //活动赠送
        Adjust: 0, //系统调整
        Bonus: 0, //分红
        BuyTd: 0, //TD/BTC买入TD所花的BTC
        BuyTdOrder: 0, //TD/BTC买入挂单金额
        BuyTdTrading: 0, //内部转账交易买入TD所得BTC
        FutresBack: 0, //划到合约账户
        Pay: 0, //充值
        SellTd: 0, //TD/BTC卖出TD所得BTC
        SellTdTrading: 0, //内部转账交易卖出TD所花BTC
        SpotCome: 0, //划回币币账户
        Withdraw: 0, //提现
        balance: 0 //币币账号余额
      },
      Td: {
        Activity: 0, //TD活动奖励
        Adjust: 0, //系统调整
        BuyTd: 0, //TD/BTC买入TD数
        BuyTdOrder: 0, //TD/BTC卖出挂单数量
        BuyTdTrading: 0, //内部转账交易买入TD（已完成)
        Commission: 0, //邀请返佣
        Fee: 0, //手续费（买入TD支付的手续费）
        FeeTd: 0, //抵扣手续费TD
        Private: 0, //私募
        SellTd: 0, //TD/BTC卖出TD数量
        SellTdTrading: 0, //内部转账交易卖出TD（进行中或已完成
        balance: 0 //TD账号余额
      },
      dySpotBtc: {},
      DyTd: {},
      remarks: ""
    };
  },
  computed: {
    hostConfig: function() {
      return this.$store.state.hostConfig;
    }
  },
  methods: {
    getCoinInfo() {
      fetchData("coinInfo").then(data => {
        var item = {};
        var item2 = {};
        for (let i in data.list) {
          item[data.list[i].Id] = data.list[i].Code;
          if (data.list[i].Id != 11 && data.list[i].Id < 100) {
            item2[data.list[i].Id] = data.list[i].Code;
          }
        }
        this.currencyNumber = item;
        this.currentCoin = item2;
        this.currentCoin[1101] = "TD-已锁定";
        this.currentCoin[1102] = "TD-已解锁";
      });
    },
    // 获取用户信息
    fetchUserInfo(uid) {
      if (!uid) return false;
      fetchData("userSearch", {
        uids: uid
      }).then(data => {
        if (data && data.list && data.list.length) {
          this.userInfo = data.list[0];
          this.Remarks = this.userInfo.Remarks;
          this.userInfo.userType = userType[data.list[0].Type];
          this.userInfo.AgentModeType = agentModeType[data.list[0].AgentMode];
          this.userInfo.vip = data.list[0].Vip;
          this.searchPermissions(); //获取权限信息
        }
      });

      fetchData("userDaiyu2", { uids: uid }).then(data => {
        this.DyTdlist2 = this.delete0(data.Personal);

        this.DySpotlist = this.delete0(data.Spot);
        this.DyFutureslist = this.delete0(data.Reverse);
        this.DyCfdlist = this.delete0(data.Cfd);
      });
    },
    delete0(data) {
      var returnItem = [];
      for (let i = 0; i < data.length; i++) {
        var isAll0 = false;
        for (var key in data[i]) {
          if (key !== "Currency" && typeof data[i][key] == "number") {
            if (data[i][key] != 0) {
              isAll0 = false;
              break;
            } else {
              isAll0 = true;
            }
          }
        }
        if (!isAll0) {
          returnItem.push(data[i]);
        }
      }
      return returnItem;
    },
    searchPermissions() {
      fetchData("userSearchpermissions", {
        uids: this.userInfo.Uid
      }).then(data => {
        if (data) {
          if (data.date == null) {
            this.selectFuturesPermission = ["all", "cancel", "close", "open"];
            this.selectCfdPermission = ["all", "cancel", "close", "open"];
            this.selectSpotPermission = ["all", "buy", "cancel", "sell"];
            this.selectWalletPermission = [
              "all",
              "deposit",
              "withdraw",
              "transfer",
              "switch"
            ];
          } else {
            if (data.date.futures == null) {
              this.selectFuturesPermission = ["all", "cancel", "close", "open"];
            } else {
              this.selectFuturesPermission = this.obj2array(data.date.futures);
            }
            if (data.date.cfd == null) {
              this.selectCfdPermission = ["all", "cancel", "close", "open"];
            } else {
              this.selectCfdPermission = this.obj2array(data.date.cfd);
            }
            if (data.date.spot == null) {
              this.selectSpotPermission = ["all", "buy", "cancel", "sell"];
            } else {
              this.selectSpotPermission = this.obj2array(data.date.spot);
            }
            if (data.date.wallet == null) {
              this.selectWalletPermission = [
                "all",
                "deposit",
                "withdraw",
                "transfer",
                "switch"
              ];
            } else {
              this.selectWalletPermission = this.obj2array(data.date.wallet);
            }
          }
        }
      });
    },
    obj2array(obj) {
      var array = [];
      for (var i in obj) {
        if (obj[i] == 1) {
          array.push(i);
        }
      }
      return array;
    },
    // 权限设置
    setPermission() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      this.PermissionVisible = true;
    },
    submitPermission() {
      var Futures = ["all", "open", "close", "cancel"];
      var Cfd = ["all", "open", "close", "cancel"];
      var Spot = ["all", "buy", "sell", "cancel"];
      var Wallet = ["all", "deposit", "withdraw", "transfer", "switch"];
      fetchData("userPermissions", {
        futures: this.getTheSame(Futures, this.selectFuturesPermission),
        cfd: this.getTheSame(Cfd, this.selectCfdPermission),
        spot: this.getTheSame(Spot, this.selectSpotPermission),
        wallet: this.getTheSame(Wallet, this.selectWalletPermission),
        uids: this.userInfo.Uid
      }).then(data => {
        this.PermissionVisible = false;
        if (data) {
          this.fetchUserInfo(this.uid);
          this.$Notification.success("操作成功");
        }
      });
    },

    // 修改密码
    changePassword() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      this.$prompt("请输入新密码", "修改密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value) {
            fetchData("userPassword", {
              uid: this.userInfo.Uid,
              password: md5(value)
            }).then(data => {
              if (data) this.$Notification.success("操作成功");
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 账号解绑
    accountUnbind() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      if (!this.userInfo.GgAuth && !this.userInfo.Mobile) {
        this.$message.error("改账号未绑定任何信息");
        return false;
      }
      this.unbindVisible = true;
    },
    // 提交解绑
    submitUnbind() {
      if (!this.unbindElement) {
        return false;
      }
      fetchData("userUnbind", {
        auth_type: this.unbindElement,
        uid: this.userInfo.Uid
      }).then(data => {
        this.unbindVisible = false;
        if (data) {
          this.fetchUserInfo(this.uid);
          this.$Notification.success("操作成功");
        }
      });
    },
    // 更改账号类型
    changeUserType() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      this.selectUserType = this.userInfo.Type;
      this.remarks = this.userInfo.Remarks;
      this.userTypeVisible = true;
    },
    // 提交账号类型更改
    submitUserType() {
      fetchData("userType", {
        type: this.selectUserType,
        uid: this.userInfo.Uid,
        remarks: this.remarks
      }).then(data => {
        this.userTypeVisible = false;
        if (data) {
          this.fetchUserInfo(this.uid);
          this.$Notification.success("操作成功");
        }
      });
    },
    // 更改合伙人类型
    changeAgentType() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      this.selectAgentType = this.userInfo.AgentMode;
      this.agentTypeVisible = true;
    },
    submitAgentType() {
      fetchData("userChangeagentmode", {
        mode: this.selectAgentType,
        uid: this.userInfo.Uid
      }).then(data => {
        this.agentTypeVisible = false;
        if (data) {
          this.fetchUserInfo(this.uid);
          this.$Notification.success("操作成功");
        }
      });
    },

    // 账号加币
    accountWallet() {
      if (!this.userInfo) {
        this.$message.error("获取用户信息失败，请刷新重试");
        return false;
      }
      this.isChangeWallet = true;
    },
    // 提交账号加币
    submitChangeWallet() {
      if (!this.inputCurrency) {
        this.$message.info("请输入数量");
        return false;
      }

      const params = {
        currency: this.changeCurrency,
        uid: this.userInfo.Uid,
        action: this.selectAction, // 9002 9004
        amount: Math.abs(this.inputCurrency),
        remarks: this.currencyRemarks
      };
      if (this.inputCurrency.indexOf("-") !== -1) {
        params.type = "sub";
      } else {
        params.type = "add";
      }
      if (this.changeCurrency == "1101") {
        params.currency = "11";
        params.unlock = false;
      }
      if (this.changeCurrency == "1102") {
        params.currency = "11";
        params.unlock = true;
      }
      this.$confirm(
        `确认给账户 ${this.userInfo.Uid} ${
          params.type === "add" ? "增加" : "扣除"
        }${Math.abs(this.inputCurrency)}${
          this.currentCoin[this.changeCurrency]
        }吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          fetchData("userWallet", params).then(data => {
            this.isChangeWallet = false;
            if (data) {
              // this.depositList.forEach(function(element, index) {
              //   if (
              //     element.Currency ===
              //     this.currentCoin[this.changeCurrency]
              //   ) {
              //     if (params.type === "add") {
              //       element.Quantity =
              //         element.Quantity + Math.abs(this.inputCurrency);
              //     } else {
              //       element.Quantity =
              //         element.Quantity - Math.abs(this.inputCurrency);
              //     }
              //   }
              // }, this);
              this.inputCurrency = "";
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatterTNE(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      var m = date.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return date.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    },
    formatterC(row, column) {
      return this.currencyNumber[row.Currency];
    },
    formatter0(row, column) {
      var data = row[column.property];
      if (data == 0) {
        return "-";
      }
      return data;
    },
    toNonExponential(num) {
      if (num != undefined) {
        var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
      }
    },
    getTheSame(attendUid, dataattendUid) {
      var result = new Array();
      var c = dataattendUid.toString();
      for (var i = 0; i < attendUid.length; i++) {
        if (c.indexOf(attendUid[i].toString()) > -1) {
          for (var j = 0; j < dataattendUid.length; j++) {
            if (attendUid[i] == dataattendUid[j]) {
              attendUid[i] = 1;
            }
          }
        } else {
          attendUid[i] = 2;
        }
      }
      return attendUid.join(",");
    },
    async createdFun() {
      await this.getCoinInfo();
      await this.fetchUserInfo(this.$route.query.uid);
    }
  },
  created() {
    this.createdFun();
  }
};
</script>

<style lang="less">
.remarksInput {
  margin-top: 20px;
}
.user-detail {
  .el-card__header {
    border-bottom: 0;
  }
  .el-card__body {
    padding: 0 20px 20px;
  }
  .box-card {
    margin-bottom: 30px;
  }
  .info-header {
    strong {
      color: #666;
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .info-body {
    p {
      color: #999;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .info-item {
    margin: 20px 0;
    .el-button {
      width: 100%;
    }
  }
  .asset-card {
    padding-top: 30px;
    h4 {
      color: #666;
      font-size: 16px;
      line-height: 36px;
    }
    .user-table {
      padding: 20px 20px 40px;
    }
  }
  .user-unbind {
    .el-dialog__body {
      padding: 30px 50px;
    }
  }
}
</style>


