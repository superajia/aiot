<template>
	<view class="page">
		<view class="frame">
			<view style="padding:20rpx 30rpx 0;font-weight:700;justify-content:center;">{{infor.name}}</view>
			<view style="padding:4rpx 30rpx 10rpx;justify-content:center;font-size:12px;color:#808080">IMEI : {{infor.device_id}}</view>
			<view class="my-line"></view>
			<view class="icons">
			
				<view class="icon" @tap="gotopage" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-page.png"></image>设备资料</view>
				<view class="icon" @tap="gotonews" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-news.png"></image>通知管理</view>
				<view class="icon" @tap="gotoswitch" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-switch.png"></image>功能开关</view>
				<view class="icon" @tap="gotowork" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-work.png"></image>情景模式</view>
				
				<view class="icon" @tap="gotovoice" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-voice.png"></image>远程录音</view>
				<!-- <view class="icon" @tap="gotocamera" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-camera.png"></image>远程拍照</view> -->
				<view class="icon" @tap="gotohealth" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-alert.png"></image>报警参数</view>
				<view class="icon" @tap="gotofence" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-fence.png"></image>电子围栏</view>
				<view class="icon" @tap="gotovcar" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-vcar.png"></image>视频监控</view>
				
				<view class="icon" @tap="gotosearch" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-search.png"></image>找设备</view>
				<view class="icon" @tap="gotoreset" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-reset.png"></image>远程重启</view>
				<view class="icon" @tap="gotoclose" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-close.png"></image>远程关机</view>
				<view class="icon" @tap="gotoset" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-set.png"></image>设置</view>
				
				<!-- <view class="icon"></view>
				<view class="icon"></view>
				<view class="icon"></view> -->
				<!-- <view class="icon" @tap="gotomonitor" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-search.png"></image>监听</view> -->
			    
			</view>
				<view  hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"></view>
		</view>
	</view>
</template>

<script>
import vuex from 'vuex'	
export default {
	data() {
		return {
			isandroid:true,
		}
	},
	computed: {
		url(){return this.$store.state.url},
		token() {return this.$store.state.logindata.token},
		infor() {return this.$store.state.information},
		location(){return this.$store.state.location},
	},
	onLoad(){
		console.log("load");console.log(this.infor);
	},
	onShow(){
		console.log("show");
		this.req();
	},
	methods:{
		gototelnum(){uni.navigateTo({url:'telnum'})},
		gotocall(){uni.navigateTo({url:'call'})},
		gotochat(){uni.navigateTo({url:'chat'})},
		gotosos(){uni.navigateTo({url:'sos'})},
		gotonews(){uni.navigateTo({url:'news'})},
		gotoheart(){uni.navigateTo({url:'heart'})},
		gotoclock(){uni.navigateTo({url:'clock'})},
		gotocamera(){uni.navigateTo({url:'photo'})},
		gotovoice(){uni.navigateTo({url:'voice'})},
		gotoreset(){uni.navigateTo({url:'reset'})},
		gotohealth(){uni.navigateTo({url:'health'})},
		gotofence(){uni.navigateTo({url:'fence'})},
		gotopage(){uni.navigateTo({url:'page'})},
		gotosearch(){uni.navigateTo({url:'search'})},
		gotoswitch(){uni.navigateTo({url:'switch'})},
		gotoclose(){uni.navigateTo({url:'close'})},
		gotoset(){uni.navigateTo({url:'set'})},
		gotowork(){uni.navigateTo({url:'work'})},
		gotovcar(){uni.navigateTo({url:'vcar'})},
		req(){
			uni.request({url:this.url +"/device_set_person/?tel_id="+this.infor.device_id,method:"GET",header:{"authorization": this.token},sslVerify:false,
			success: (res) => {
				if (res.data.code == 1000) {
					this.$store.commit("setorder",res.data.data);
					// console.log(res);
				}else{
					console.log(res);var error = "错误码:"+res.statusCode;
					if(res.data.code){error=res.data.error};
					uni.showToast({title:error,icon:"none",duration:2000});
				}
			},
			fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
			});
		}
	}
}
</script>

<style>
	.frame{
		margin:24rpx auto;
		width:700rpx;
		flex-direction:column;
		background-color:#fff;
		border-radius:20rpx;
		box-shadow:1px 1px 6px #aaa;
	}
	.my-line{
		margin:0 30rpx;
	}
	.icons{
		padding-top:20rpx;
		flex-flow:row wrap;
		justify-content:space-around;
	}
	.icon{
		width:120rpx;
		height:120rpx;
		padding:30rpx 20rpx 10rpx;
		margin-bottom:20rpx;
		border-radius:20rpx; 
		flex-direction: column;
		justify-content:space-around;
		align-items:center;
		font-size:12px;
		color:#606060;
	}
</style>
