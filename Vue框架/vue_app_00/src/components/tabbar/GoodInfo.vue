
<template>
  <div class="app_goodInfo">
    <div class="mui-card">
				<div class="mui-card-header">
          商品名称：{{info.title}}
        </div>
				<div class="mui-card-content">
					<div class="mui-card-content-inner">
						售价：¥{{info.price}}
					</div>
				</div>
				<div class="mui-card-footer">
          <mt-button type="danger" size="small" @click="addcart">加入购物车</mt-button>
        </div>
			</div>
  </div>
</template>

<script>
import {Toast} from "mint-ui";
export default {
  data(){
    return{
      // 上一个组件传入
      lid:this.$route.query.lid,
      info:{}
    }
  },created(){
    this.findProuct();
  },methods:{
    findProuct(){
      var url=`http://127.0.0.1:3000/findProduct?lid=${this.lid}`;
      this.axios.get(url).then(result=>{
        console.log(result);
        this.info = result.data.data[0];
        

      })
    },addcart(){
                var pid=this.lid;
        var price=this.info.price;
        var pname=this.info.pname;
      var url="http://127.0.0.1:3000/addcart?pid="+pid+"&pname="+pname+"&price="+price;
      console.log(url);
      this.axios.get(url).then(result=>{
        console.log(result);
        this.$store.commit("increment");
        Toast("成功、购物车");
        return;
      })
    }
  }
}
</script>

<style>

</style>
