<template>
  <div class="public-view">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-card shadow="hover" class="works">
          <div slot="header" class="clearfix">
            <span>课程设置</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <el-row :gutter="10">
              <el-col :span="8" v-for="o in demoData" :key="o.title">
                <el-card class="img-card" shadow="hover">
                  <router-link to="student" :key="o.title">
                    <div class="image">
                      <el-image :src="o.img" fit="fill" lazy :key="o.title">
                        <div slot="placeholder" class="image-slot">
                          加载中
                          <span class="dot">...</span>
                        </div>
                      </el-image>
                    </div>
                    <div class="img-title">
                      <span>{{o.title}}</span>
                    </div>
                  </router-link>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>最新公告</span>
          </div>
          <div class="notice">
            <marquee direction="up" scrollamount="5">
              广州乔古形象设计有限公司是由知名造型师李达创立，联合旗下数十位星级化妆造型师及导师团队共同打造新时代风尚美妆品牌。合作艺人明星众多，常活跃于各大品牌时装发布会台前幕后，包括国际四大时装周、中国国际时装周都能看到我们造型师的身影。旗下造型师们都拥有扎实的技术功底，妆感时尚干净，发型造型能力突出，注重技术的全面性，因此深受艺人歌手演员们的喜爱旗下每位签约造型师都必须拥有过硬的全能型技术能力和服务水平，注重技术能力之余更加注重服务水平和为人处事，势必打造最优质的服务团队。
              旗下喬古造型美妆学院的化妆培训优势在于教学导师们都是中国一线的造型师，化妆造型培训教学内容定期更新以顺应时尚的更替，针对时下的流行时尚系统分解传授技巧，注重妆发整体能力的教学，培养学员的创新能力，导师们都拥有多年的工作经验，所涉及的化妆类型多样，广告、T台、平面、舞台
            </marquee>
          </div>
        </el-card>
        <el-card shadow="hover" class="margin-top">
          <div slot="header" class="clearfix">
            <span>关于我们</span>
          </div>
          <div class="notice">
            广州乔古形象设计有限公司是由知名造型师李达创立，联合旗下数十位星级化妆造型师及导师团队共同打造新时代风尚美妆品牌。合作艺人明星众多，常活跃于各大品牌时装发布会台前幕后，包括国际四大时装周、中国国际时装周都能看到我们造型师的身影。旗下造型师们都拥有扎实的技术功底，妆感时尚干净，发型造型能力突出，注重技术的全面性，因此深受艺人歌手演员们的喜爱旗下每位签约造型师都必须拥有过硬的全能型技术能力和服务水平，注重技术能力之余更加注重服务水平和为人处事，势必打造最优质的服务团队。
            旗下喬古造型美妆学院的化妆培训优势在于教学导师们都是中国一线的造型师，化妆造型培训教学内容定期更新以顺应时尚的更替，针对时下的流行时尚系统分解传授技巧，注重妆发整体能力的教学，培养学员的创新能力，导师们都拥有多年的工作经验，所涉及的化妆类型多样，广告、T台、平面、舞台
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Moment from "moment";
import { fetchData } from "@/api";
import SliderItem from "@/components/Slider";
export default {
  data() {
    return {
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
        },
        {
          img:
            "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          title: "图片7"
        }
      ]
    };
  },
  components: {
    SliderItem
  },
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.public-view {
  padding-top: 10px;
}
.notice {
  height: 500px;
  line-height: 30px;
  font-size: 12px;
  overflow: hidden;
}
.margin-top {
  margin-top: 10px;
}
.course-img {
  margin-bottom: 20px;
}
.img-card {
  // padding: 20px;
  height: 313px;
  border: 0;
  box-shadow: 0 2px 12px 0 #fff;
  overflow: hidden;
  margin-bottom: 10px;
  .image {
    display: flex;
    align-items: center;
    height: 220px;
  }
  .img-title {
    padding: 14px;
    text-align: center;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>

