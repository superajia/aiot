<template>
	<view class="page">
		<view class="my-header">长按联系人可以编辑或删除<view style="border-bottom:2rpx solid #aaaaaa;width:50%"></view></view> 
		<view class="my-frame" v-for="(value,key) in telList" :key="key">
			<view class="my-cell-start" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @longpress="pick(value)">
				<view class="img">
					<image style="width:45px;height:45px;" src="/static/header1.png"></image>
				</view>
				<view class="my-cell-list">
					<view class="">{{value.name}}</view>
					<view style="font-size:28rpx;color:#808080;line-height:1.2;">{{value.num}}</view>
				</view>
				<span class="iconfont icon-right">&#xe61b;</span>
			</view>
		</view>
		<view v-if="isshow" class="no-content"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
		<view style="width:100%;height:200rpx;"></view>
		<view style="position:fixed;bottom:0;z-index:100;background-color:#efefef;width:750rpx;height:210rpx"></view>
		<view style="position:fixed;bottom:120rpx;left:25rpx;z-index:200;">
			<button hover-class="hover" @tap="add">新建联系人</button>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				telList:[],//电话列表
				isshow:false,//是否显示暂无数据
				id:1,//当前剩余空位的索引
			}
		},
		computed:{
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
			device_id(){return this.$store.state.information.device_id},
		},
		onShow(){
			console.log("show");this.reqTelnum();
		},
		onLoad(option) {
			console.log("load");
		},
		methods: {
			reqTelnum(){
				var that = this;
				uni.request({url:this.url +"/device_set_person/?tel_id="+this.device_id,method:"GET",header:{"authorization": this.token},
				success: (res) => {
					if (res.data.code == 1000){
						console.log("电话列表请求成功");
						var v = [];
						if(res.data.data){var v = res.data.data.phonebook}
						if(!v||v.length==0){
							that.telList = [];
							that.isshow = true;
						}else{
							that.isshow = false;
				            var list = [];var without = 1;
							// var v = ["4,小明,123456","3,小化,4356436","6,嘿嘿,889900","7,琪琪,234123123","1,琪琪,234123123","2,琪琪,234123123"];
							
							//拆分字符串为列表
							v.forEach((item,i)=>{list.push({id:Number(item[0]),name:item[1],num:item[2]})})
							
							//排序
							list.sort(function(a,b){if(a.id<b.id){return -1;}if(a.id>b.id){return 1;}return 0;})

							//找出空缺索引
							list.forEach((item,i)=>{if(item.id==without){without++}})
							that.telList = list;that.id = without;
						}
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});that.isshow = true;
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});that.isshow = true;}
				});
			},
			pick(v) {
				var that =this;
				uni.showActionSheet({
					itemList: ['编辑', '删除', '取消'],
					success: function(res) {
						if(res.tapIndex == 0){
							uni.navigateTo({url:"telnum-infor?id="+v.id+"&name="+v.name+"&num="+v.num})
						} else if (res.tapIndex == 1) {
							var id = v.id+"";
							var data = {"param_data":{"device_id":that.device_id,"set_command":"del_phonebook","set_value":id}};
							uni.request({
								url:that.url+"/device_set_person/",method:"POST",
								header:{"authorization":that.token,},data:data,
								success: (res) => {
									if (res.data.code == 1000) {
										uni.showToast({icon:'none',title:"删除联系人成功",duration:2000});
										that.reqTelnum();
							        }else{console.log(res);var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});};
							    },
							    fail:(res) =>{console.log(res);uni.showToast({icon: 'none',title:"请检查网络",duration:2000});}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			add(){
				if(this.id>30){uni.showToast({icon:'none',title:"联系人列表已满,请编辑或删除后再新建",duration:2000});return}
				uni.navigateTo({url:'telnum-infor?id='+this.id})
			},
		},
		onUnload(){}
	}
</script>

<style>
.no-content{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	margin-top:60rpx;
}
	.my-cell-start {
		border-radius:10px;
		padding: 22rpx 40rpx;
	}
	.my-cell-list {
		padding: 0 20rpx;
		line-height: 1;
	}

	.icon-right {
		position: absolute;
		top: 34rpx;
		right: 24rpx;
		color: #808080;
		line-height: 1.5;
		font-size: 46rpx;
	}
/* 	.icon-right {
		position:absolute;
		top:28rpx;
		right:16rpx;
		color: #808080;
		font-size:50rpx;
	} */
</style>
