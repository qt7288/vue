<template>
    <div id="Tabke">
            <mt-header fixed class="a" title="F">
                <router-link to="Search" slot="right">
                    <span class="mui-icon mui-icon-plusempty"></span>
            </router-link>
            </mt-header>
            <!-- 快速搜索好友栏 -->
            <!-- <div class="sayHeader">          -->
                <!-- <input type="text" placeholder="searchFriends……" class="search"> -->
            <!-- </div> -->
            <!-- 好友栏 -->
            <div id="friends">

                <!--  -->
                <div class="Tabke" style="color:#fff"><span>好友栏</span>
                </div>
                 <!-- v-for="(aa,w) of myToa" :key="w" :class="aa.stateU == 1 ? 'blue':'red'" -->
                <div class="card" v-for="(item,i) of myList" :key="i" @click="btn1(item.frienduname,item.friendid)">
                    <div class="fHeader" :class="w==true?'sun':'night'"> 
                        <p>{{item.frienduname}}</p>             
                    </div>
                    <!-- :class="this.$store.state.sun==?'sun':'night'" -->
                    <!-- <div class="fBody"> -->
                        <!-- <p>{{item.friendid}}</p> -->
                    <!-- </div> -->
                </div>
            </div>
    </div>
</template>
<script>
import {Toast} from "mint-ui"
export default {
    data(){
        return {
            myList:[],
            isT:true,
            www:this.$store.state.uname,
            qid:this.$store.state.uid,
            w:this.$store.state.sun   
        }
    },
    methods:{
        btn1(msg1,msg2){
            // //console.log(msg1,msg2);
            this.$router.push("/sayDouble?uname="+msg1+"&friendid="+msg2); 
        },friends(){
            var url = "http://127.0.0.1:3000/selectUname?id="+this.$store.state.uid;
            this.axios.get(url).then(result=>{
            //console.log(result);
            if(result.data.code==1){
                this.myList=result.data.result
            }else{
            }
        });
        },
        aa(){
            console.log("aa");
        }
    },mounted(){
        this.friends();
    }
}
</script>
<style scoped>
    .search{
        border:0;
        box-sizing: border-box;
        border-bottom: 1px solid black;
        position: relative;
        height: 2rem;
        border-radius: 0;
        font-size: 6px;
        text-align: center;
    }
    #Tabke{
        background:transparent;
    }
    .sayHeader{
        width: 96%;
        margin:0 auto;
        height:30px;
        border: 0;
        line-height:30px;
        margin-bottom: 10px; 
    }
    .sayHeader input{
        background: rgb(255, 255, 255);
        border:0;
        outline: none;
        box-shadow: 0 0 6px black inset;
    }
    #friends{
        top:10px;
        position: relative;
        height:40px;
        margin-top:0;
        line-height:40px;
        width: 96%;
        border: 0;
        margin: 0 auto;
    }
    /* 控制单好友槽 */
    .card{  
        border-radius: 10px;
        height:100%;
        margin-top:2px;
         background: rgba(119, 119, 119, 0.8);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.322);
    }
    .card div:first-child{
        border:0;
        border-radius:10px;
        box-shadow: 0 0 6px rgb(131, 131, 131) inset;
    }
    .card div:first-child:active{
        background: rgba(255, 255, 255, 0.7);
    }
    .fHeader,.fBody{
        float: left;
        height:40px;
        box-sizing: border-box;
    }
    .fHeader{
         width:100%;
        display: block;
        padding-left: 10px;
        text-align: left;     
    }
    .fHeader>p{
        color: #fff;
    }
    .fBody{
        padding-right: 10px;
        text-align: right;
    }
    .mint-header{
        background:transparent;
        border-radius: 10px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
    }
    .sun{
    background: rgba(255, 254, 254);
    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.897);
    }
    .sun>p{
        color: rgb(0, 0, 0);
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.836);
    }
    /* 夜间模式样式 */
    .night{
        background: rgba(119, 119, 119, 0.24);
    }
    .night>p{
        color: rgba(255, 255, 255, 0.747);
    }
    .Tabke{
        text-align: left;
        font-size: 10px;
    }
</style>
