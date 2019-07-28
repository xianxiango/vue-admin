<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <!-- <el-button type="info" class="address-number" style="margin: 10px 0 10px ;display:block">
          已用地址总数：
          <vue-count :startVal="0" :endVal="usedNumber" :duration="2000"></vue-count>
        </el-button>
        <el-button
          type="success"
          class="address-number"
          v-for="item in unusedCoin"
          :key="item.Coin"
          style="margin: 10px  0 10px;display:block"
        >
          {{currencyNumber[item.Coin]}}可用地址总数：
          <vue-count :startVal="0" :endVal="item.Total" :duration="3600"></vue-count>
        </el-button>-->
        <el-table
          class="public-table"
          :data="unusedCoin"
          border
        >
          <el-table-column
            prop="Coin"
            label="币种"
            :formatter="formatterC"
          ></el-table-column>
          <el-table-column
            prop="Total"
            label="可用地址数量"
          ></el-table-column>
          <el-table-column
            prop="Value"
            label="地址余额"
          ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="header-right">
        <!-- <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、地址'"
          v-model="inputText"
        >
          <el-tag
            v-for="(item, index) in labelList"
            :key="index"
            slot="suffix"
            size="small"
            closable
            @close="removeTags(index)"
          >{{item}}</el-tag>
          <el-button @click.native.prevent="submitSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>-->
        <div style="position: absolute;width: 50%;z-index: 1000;background: #fff;" v-click-outside="searchHide">
          <el-card v-if="searchShowOrHide" class="box-card searchbox">
            <el-input
              v-for="(item,index) in dynamicTable"
              :key="item.name"
              @keyup.enter.native="submitSearch"
              :placeholder="item.label"
              v-model="item.inputText"
              v-if="item.isSearch"
              style="margin-top:5px"
              clearable
              @clear="searchClear"
            >
              <template slot="prepend">{{item.label}}</template>
              <i
                slot="prefix"
                v-if="item.isTime"
                class="el-input__icon el-icon-date"
                @click="selectTime"
              ></i>
              <el-tag
                v-for="(item, index) in labelList"
                :key="index"
                slot="suffix"
                size="small"
                closable
                @close="removeTags(index)"
              >{{item}}</el-tag>
              <el-button
                v-if="index==0"
                @click.native.prevent="submitSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-card>
          <!--给按钮绑定点击事件-->
          <el-button
            class="searchButton"
            @click="searchShow()"
            :icon="searchIcon"
          >{{searchShowOrHideText}}</el-button>
        </div>
      </div>
    </div>
    <!-- 表格  -->
    <el-table
      class="public-table"
      :data="list"
      border
      v-loading="loading"
      show-summary
      @selection-change="handleSelectionChange"
      :summary-method="getSummaries"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="item.name !== 'address'">{{scope.row[item.name]}}</span>
          <a
            v-else
            :href="scope.row.addressPath + scope.row.address+((scope.row.address.substr(0, 2) == '0x')?'#tokentxns':'')"
            target="_block"
            class="jump-detail jump-color"
          >
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination
      background
      @size-change="handleSize"
      @current-change="handlePage"
      :current-page="page"
      :page-sizes="sizeList"
      :page-size="size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import { fetchData } from "@/api";
import VueCount from "vue-count-to";
import SearchMixin from "@/mixins/search";
import {
  // addressPath,
  addresslabel,
  bugUid
} from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  components: {
    VueCount
  },
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      requestUrl: "addressList",
      searchUrl: "addressSearch",
      dynamicTable: [
        { name: "uid", value: true, label: "Uid", isSearch: true },
        { name: "id", value: true, label: "编号" },
        { name: "currency", value: true, label: "币种", isSearch: true,handler: this.coinHandler },
        {
          name: "address",
          value: true,
          label: "地址",
          width: 460,
          isSearch: true
        },
        { name: "balance", value: true, label: "余额" },
        { name: "status", value: true, label: "标记" },
        { name: "createAt", value: true, label: "时间" }
      ],
      addressPath: {
        
      },
      filterSummaries: [], // 需要统计的字段
      unusedNumber: 0,
      usedNumber: 0,
      unusedCoin: [],
    };
  },
  created() {
    this.fetchAddressUnused();
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          id: element.Id,
          uid: element.Uid,
          currency: this.currencyNumber[element.Currency],
          address: element.Address,
          balance: element.Balance == "" ? 0 : element.Balance,
          addressPath: this.addressPath[this.currencyNumber[element.Currency]]? this.addressPath[this.currencyNumber[element.Currency]].Address:'',
          sign: element.Sign,
          status: element.Status==0?"未使用":"已使用",
          createAt: element.CreateTime.replace("T", " ").substring(0, 19),
          detail: element
        });
      }, this);
      this.list = list;
    },
    coinHandler(item) {
      const cmdId = Object.keys(this.currencyNumber).find(
        val => this.currencyNumber[val] === item
      );
      if (cmdId) {
        return cmdId;
      }
    },
    
    
    arrayMemberLen(val, len) {
      let array = val.split(",");
      for (let i = 0; i < array.length; i++) {
        if (array[i].length != len) {
          return "0";
        }
      }
      return "1";
    },
    // 获取未使用的地址
    fetchAddressUnused() {
      fetchData("addressUnused", {
        page_no: 1,
        page_size: 10
      }).then(data => {
        if (data) {
          this.unusedNumber = data.notused;
          this.usedNumber = data.used;
          this.unusedCoin = data.list;
        }
      });
    },
    formatterC(row, column) {
      return this.currencyNumber[row[column.property]];
    }
  },
  
};
</script>

<style lang="less" scoped>
.address-number {
  cursor: text;
}
</style>

