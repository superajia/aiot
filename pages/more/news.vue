<template>
	<view class="page">
		<view class="my-before">设置中心号码,用于接收短信通知</view>
		<view class="my-frame-little" style="margin-bottom:10rpx;">
			<view class="my-cell-big" @tap="isshownum=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>中心号码</view><view style="color:#808080;width:250rpx;justify-content:flex-end;padding-right:24rpx;">{{v_num}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
		</view>
		<view class="my-before">开启短信通知</view>
		<view class="my-frame-little" style="padding:6rpx 0;">
			<view class="my-cell">
				<view>低电量通知</view><switch  :checked="v_low" @change="changelow"/></view>
			<view class="my-cell">
				<view>拆除手表通知</view><switch  :checked="v_remove" @change="changeremove"/></view>
		</view>
		
		<!-- 设置中心号码的蒙层 -->
		<view class="my-mask" v-if="isshownum">
			<view class="wrap1">
			    <view class="my-cell-top">中心号码设置</view>
			    <input class="my-input" type="number"  placeholder-class="placeholder" placeholder="请输入号码" maxlength="11" name="name" v-model="initnum"/>
			    <view class="my-cell">
			    	<view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="isshownum=false">取消</view>
			    	<view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm">确定</view>
			    </view>
			</view>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			var order = this.$store.state.order;
			var v_num ='0',v_low =false,v_remove =false;
			if(order){
				if(order.center_num_set){v_num = order.center_num_set;};
				v_low = Boolean(Number(order.low_power_msg));
				v_remove = Boolean(Number(order.dev_remove_msg));
			}
			return {
				v_num,v_low,v_remove,
				initnum:v_num,
				isshownum:false,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		onLoad() {
			console.log("load"); 
		},
		methods:{
			//确定:将设置的号码 ==> 显示的号码 , 并下发中心号码指令
			confirm(e){this.v_num = this.initnum;this.isshownum = false;this.req("center_num_set",this.v_num,"中心号码设置");},
			//获取切换值,并下发低电量指令
			changelow(e){var v = Number(e.detail.value);this.req("low_power_msg",v,"短信通知设置");},
			//获取切换值,并下发拆除手表指令
			changeremove(e){var v = Number(e.detail.value);this.req("dev_remove_msg",v,"短信通知设置");},
			//下发指令的通用函数
			req(order,value,title){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showModal({title:title,content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:title,content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
		},
		
	}
</script>

<style>
.icon-right{
	position:absolute;
	top:26rpx;
	right:16rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;
}
.wrap1{
	width:680rpx;
	height:344rpx;
	margin:300rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px; 
	overflow: hidden;
	position:relative;
}

.my-input{
	background: #efefef;
	margin:0 30rpx;
	border-radius: 16upx;
	padding: 20rpx 40upx;
	font-size: 19px;
	letter-spacing:0.5px;
}
</style>
