<template>
  <div class="public-view">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-card shadow="hover" class="works">
          <div slot="header" class="clearfix">
            <span>学院简介</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="synopsis-content">
            广州乔古形象设计有限公司（喬古造型）是由知名造型师李达创立，联合旗下数十位星级化妆造型师及导师团队共同打造新时代风尚美妆品牌。合作艺人明星众多，常活跃于各大品牌时装发布会台前幕后，包括国际四大时装周、中国国际时装周都能看到我们造型师的身影。旗下造型师们都拥有扎实的技术功底，妆感时尚干净，发型造型能力突出，注重技术的全面性，因此深受艺人歌手演员们的喜爱。旗下每位签约造型师都必须拥有过硬的全能型技术能力和服务水平，注重技术能力之余更加注重服务水平和为人处事，势必打造最优质的服务团队。
            广州乔古形象设计有限公司（喬古造型）旗下喬古造型美妆学院的技术培训优势在于教学导师们都是中国一线的造型师，教学内容定期更新以顺应时尚的更替，针对时下的流行时尚系统分解传授技巧，注重妆发整体能力的教学，培养学员的创新能力，导师们都拥有多年的工作经验，所涉及的化妆类型多样，广告、T台、平面、舞台、电影电视、新娘、特效等，对于学员们所能掌握的技术越全面越好，所以我们的宗旨是将所有技术用最易懂最易上手的方法传授，让学员少走弯路，并且课程安排里导师们共同研发的独家魔鬼式训练，能让学员迅速提升技能和解决工作中遇到的的各种状况。喬古造型美妆学院还针对目前国内化妆师发型技术欠缺问题，更加注重培养学员的发型造型功力，由最基本的日常、新娘、演出基本造型到T台、平面的时尚造型再到复古年代造型，细致的教大家如何应对各种场合各种造型。其外，公司还为化妆师和发型师们开办了发型研修班，主要针对工作多年的化妆师或者发型师开展的全新提升课程，研习和探讨更多工作中遇到的疑难杂症，同时掌握中国最前沿的发型造型技术，一改以往鸡肋且蹩脚的发型造型技术。（优秀学员经考核可签约广州乔古形象设计有限公司）
            喬古造型人才培养机制，势必打造华南地区最优质造型团队。现在正面向全国签约优秀的化妆造型师，你若认为自己的审美够时尚，技术功底够好就赶紧预约面试吧。签约造型师可享受公司的推广，定期的技能内部提升培训，产品工具赠送，各种活动的邀约等。
            喬古造型美妆学院旗下造型师的所有化妆、发型工具产品均从香港专柜购买或者由国外代购，主要的化妆产品有：CHANEL,DIOR,BOBBI BROWN,MAC,MAKE UP FOR EVER,NARS,SHU UEMURA,SHISEIDO，LAURA MERCIER,CPB,IMPRESS,SUQQU,BECCA等；发型产品：L'OREAL，SCHWARZKOPF,WELLA,GOLDWELL,TIGI,SEBASTIAN等。护肤类：LA PRAIRIE,LA MER,SISLEY,FANCL,SK-Ⅱ等。
            学院环境：

            <el-image v-for="url in demoData" :key="url.img" :src="url.img" lazy></el-image>
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
            <span>联系我们</span>
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
.synopsis-content {
  // height: 350px;
  font-size: 12px;
  line-height: 1.8;
}

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
.course {
  height: 160px;
}
.course-img {
  margin-bottom: 20px;
}
</style>

