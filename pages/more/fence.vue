<template>
	<view class="page">
		<view class="my-header">点击查看详情，长按可删除<view style="border-bottom:2rpx solid #aaaaaa;width:50%"></view></view> 
		<view class="my-frame" v-for="(value,key) in fence" :key="key">
		 	<view class="my-cell" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @longpress="pick(value)" @tap="goFence(value)">
		 		<view class="img"><image style="width:36px;height:36px;" src="/static/fence.png"></image></view>
		 		<view class="name">{{value.name}}</view>
		 		<view class="type">类型 : {{value.type}}</view>
		 		<span class="iconfont icon-right">&#xe61b;</span>
				<view class="bottom">有效时间 : {{valid(value)}}</view>
		 	</view>
		</view>
		<view v-if="isshow" class="no-content"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
		<view style="width:100%;height:200rpx;"></view>
		<view style="position:fixed;bottom:0;z-index:100;background-color:#efefef;width:750rpx;height:210rpx"></view>
		<view style="position:fixed;bottom:120rpx;left:25rpx;z-index:200;">
			<button hover-class="hover" @tap="add">添加围栏</button>
		</view>
	</view>
</template>
<script>
	export default { 
		data() {
			return {
				fence:[],//设备的围栏列表
				fenceList:null,//请求来的所有围栏列表
				isshow:true,//是否显示暂无数据
			}
		},
		computed:{
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
			id(){return this.$store.state.information.device_id},
		},
		onShow(){
			this.reqFence();
		},
		methods: {
			reqFence(){
				var that = this;
				uni.request({
					url:that.url+"/electric_fence/",
					method: "GET",sslVerify:false,
					header:{"authorization":that.token},
					success: (res) => {
						if(res.data.code==1000){
						 //    console.log("围栏列表请求成功");
							// console.log(res); 
						// console.log(res);
						// "device_list":[{"id":1058,"device_id": "9003","name": "调度1","efence":0},
						// "fence_list":[{"id":3,"name": "测试","name_id":"0","kind":"circle","content":[757.8849259378769,{"lng":114,"lat": 22.623336}],                                                                   
						// 	"device_id": ["867282030891762"],"owner_id": 2}, 
						    var devList = res.data.data.device_list;
						    that.fenceList = res.data.data.fence_list;
							
						    //获取设备的围栏列表
						    devList.forEach((item,i)=>{if(item.device_id==that.id){
							    if(!item.efence){
									that.fence = [];
									that.isshow = true;
							    }else{
									that.isshow = false;
								    var v = item.efence;
								    var k = Object.keys(item.efence);
								    that.fence = [];
								    for(var i=0;i<k.length;i++){
									    var it = k[i];
									    that.fence.push({name:it,type:v[it][0],time0:v[it][1],time1:v[it][2]})
								    };
							    }
						    }});
				        }else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});that.isshow = true;
					};
				},
				    fail:(res) =>{
					    console.log(res);uni.showToast({icon: 'none',title:"请检查网络",duration:2000});that.isshow = true;
				    }
			    })
			},
			valid(v){
				var value = v.time0+" — "+v.time1;
				if(v.time0=="0"&&v.time1=="0"){value="长期有效"};
				return value;
			},
			pick(v) {
				var that =this;
				uni.showActionSheet({
					itemList: ['删除', '取消'],
					success: function(res) {if (res.tapIndex == 0) {that.delete(v);}},
					fail: function(res) {console.log(res.errMsg);}
				});
			},
			add(){this.$store.commit('setfence',null);uni.navigateTo({url:'fence-infor'})},
			delete(v){
				var id ="";
				this.fenceList.forEach((item,i)=>{
						if(item.name==v.name){
							id = item.id;
				}});
				console.log(id);
				uni.request({
					url:this.url+"/electric_fence/",method:"POST",
					header:{"authorization":this.token,},
					data:{"what":"delete","delete_type":"delete_fence","e_fence":{"id":[id]}},sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000) {
							console.log("删除围栏成功");
							this.reqFence();
				        }else{console.log(res);var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});};
				    },
				    fail:(res) =>{console.log(res);uni.showToast({icon: 'none',title:"请检查网络",duration:2000});}
				});
			},
			goFence(v){
				this.fenceList.forEach((item,i)=>{
					if(item.name==v.name){
						var temp = item;temp.time0 = v.time0;temp.time1 = v.time1;temp.type = v.type;
						this.$store.commit('setfence',temp);
						uni.navigateTo({url:"fence-infor"})
			}});}
		}
	}
</script>

<style>
.page {
	flex-direction: column;
	width: 750upx;
}
.my-cell{padding:20rpx 20rpx 50rpx;}
.img{position:absolute;top:16rpx;left:28rpx;}
.name{margin-left:88rpx;font-size:38rpx;}
.type{margin-right:60rpx;font-size:38rpx;}
.bottom{
	color:#808080;
	position:absolute;
	top:84rpx;
	left:34rpx;
	font-size:25upx;
}
.icon-right {
	position:absolute;
	top:28rpx;
	right:16rpx;
	color: #808080;
	font-size:50rpx;
}
.no-content{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	margin-top:60rpx;
}
</style>
