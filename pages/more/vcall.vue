<template>
	<view class="page">
		<view class="my-frame">
			<view class=""><image src="/static/header1.png" style="width:64px;height:64px;margin:40rpx auto 10rpx;"></image></view>
			    <view class="my-cell">{{infor.name}}</view>
		        <view class="my-cell">{{infor.device_id}}</view>
		</view>
		<view class="icon" @tap="send" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
			<image style="height:44px;width:44px" src="/static/i-vcall.png"></image>
		</view>
		<view class="my-header" style="color:#666;font-size:16px;">发起视频聊天</view>
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
	    data() {
	        return {
				infor:this.$store.state.information,
	        }
	    },
		onLoad() {
			console.log("load");
			
		},
	    methods: {
			send(){
				uni.navigateTo({
					url:'video'
				});
			}
	    }
	}
</script>

<style>
.my-cell{
	background: #e2f5fc;
	margin:30rpx;
	border-radius: 16upx;
	font-size: 38rpx;
	letter-spacing:0.5px;
}
.icon{
	width:260rpx;
	height:260rpx;
	margin:260rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
