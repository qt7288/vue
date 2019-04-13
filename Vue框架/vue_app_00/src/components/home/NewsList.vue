<template>
 <div class="app-newslist">
  <!--新闻列表 mui/media-list.html-->
   		<ul class="mui-table-view">
				<li class="mui-table-view-cell mui-media" v-for="item of list">
					<router-link :to="'/NewsInfo?nid='+item.id">
						<img class="mui-media-object mui-pull-left" :src="item.img_url">
						<div class="mui-media-body">
							{{item.title}}
							<p class='mui-ellipsis'>
        <span>{{item.ctime | datetimeFilter}}</span>
        <span>点击 {{item.point}} 次</span>
              </p>
						</div>
					</router-link>
				</li>
  	   </ul>
  <!--加载更多按钮-->
  <mt-button size="large" type="primary" @click="loadMore">加载更多</mt-button>
 </div>
</template>
<script>
  export default {
    data(){
      return {
        list:[], //返回新闻列表
        pno:0    //页码
      }
    },
    created() {
      this.loadMore()
    },
    methods:{
      //加载下一页数据
      loadMore(){
        //1:当前页数加+1
        this.pno++;
        //2:创建变量url请求地址
        var url = "http://127.0.0.1:3000";
        url+="/news?pno="+this.pno;
        //console.log(url);
        //3:发送ajax请求
        this.axios.get(url).then(result=>{
          //console.log(result.data.data);
          //this.list = result.data.data;
           var rows = this.list.concat(result.data.data);
           this.list = rows;
          //在模板中循环数组显示数据...
        });
        //4:获取服务器数据
        //5:将获取数据保存data list:[]
      }
    }
  }
</script>
<style>
/*修改 新闻内容 时间 点击次数两端对齐*/
.app-newslist .mui-ellipsis{
   display:flex;
   font-size:12px;
   color:#226aff;
   justify-content:space-between;  
} 
</style>