<template>
	<view class="page">
		<view class="frame">
			<view style="padding:20rpx 30rpx 0;font-weight:700;justify-content:center;">{{infor.name}}</view>
			<view style="padding:0 30rpx 10rpx;justify-content:center;font-size:12px;color:#808080">IMEI : {{infor.device_id}}</view>
			<view class="my-line"></view>
			<view class="icons">
				<view class="icon" @tap="gotochat" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-chat2.png"></image>微聊</view>
				<view class="icon" @tap="gototelnum" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-telnum.png"></image>电话本</view>
				<view class="icon" @tap="gotocall" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-call.png"></image>通话</view>
				<!-- <view class="icon" @tap="gotovcall" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-vcall.png"></image>视频通话</view> -->
				<!-- <view class="icon" @tap="gotopeople" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-people.png"></image>家庭成员</view> -->
				<view class="icon" @tap="gotosos" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-sos.png"></image>SOS</view>
				
				
				<view class="icon" @tap="gotopage" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-page.png"></image>设备资料</view>
				<view class="icon" @tap="gotonews" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-news.png"></image>通知管理</view>
				<view class="icon" @tap="gotoswitch" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-switch.png"></image>功能开关</view>
				<view class="icon" @tap="gotohealth" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-alert.png"></image>报警参数</view>
				
				
				<view class="icon" @tap="gotoheart" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-heart.png"></image>健康</view>
				<view class="icon" @tap="gotoclock" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-clock.png"></image>闹钟</view>
				<view class="icon" @tap="gotocamera" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-camera.png"></image>远程拍照</view>
				<view class="icon" @tap="gotofence" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-fence.png"></image>电子围栏</view>
				
				<view class="icon" @tap="gotowork" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-work.png"></image>情景模式</view>
				<view class="icon" @tap="gotosearch" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-search.png"></image>找设备</view>
				<view class="icon" @tap="gotoreset" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-reset.png"></image>远程重启</view>
				<view class="icon" @tap="gotoclose" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-close.png"></image>远程关机</view>
				
				<view class="icon" @tap="gotovcall" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-vcall.png"></image>视频通话</view>
				
				<view class="icon" @tap="gotoset" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-set.png"></image>设置</view>
				
				<view class="icon"></view>
				<view class="icon"></view>
				<!-- <view class="icon" @tap="gotomonitor" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"><image style="height:32px;width:32px" src="/static/i-search.png"></image>监听</view> -->
			    
			</view>
				<!-- <view  hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0"></view> -->
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
	},
	onLoad(){
		console.log(this.infor);
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
		gotoreset(){uni.navigateTo({url:'reset'})},
		gotohealth(){uni.navigateTo({url:'health'})},
		gotofence(){uni.navigateTo({url:'fence'})},
		gotopage(){uni.navigateTo({url:'page'})},
		gotosearch(){uni.navigateTo({url:'search'})},
		gotoswitch(){uni.navigateTo({url:'switch'})},
		gotoclose(){uni.navigateTo({url:'close'})},
		gotoset(){uni.navigateTo({url:'set'})},
		gotowork(){uni.navigateTo({url:'work'})},
		gotovcall(){uni.navigateTo({url:'vcall'})},
		req(){
			uni.request({url:this.url +"/device_set_person/?tel_id="+this.infor.device_id,method:"GET",header:{"authorization": this.token},sslVerify:false,
			success: (res) => {
				if (res.data.code == 1000) {
					this.$store.commit("setorder",res.data.data);
				}else{
					console.log(res);var error = "错误码:"+res.statusCode;
					if(res.data.code){error=res.data.error};
					uni.showToast({title:error,icon:"none",duration:2000});
				}
			},
			fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
			});
			var that = this;
			uni.request({url:this.url + "/all_on_line/",method:"GET",header:{"authorization": this.token,key:"all_on_line","map": "gd"},
			    success:(res) => {
			    	if(res.data.code == 1000){
						console.log("更新健康数据");
			    		var all = res.data.data.all_device;
						all.forEach((item, index) => {
							if(item.device_id==that.infor.device_id){
							var info = {url:that.url,token:that.token,name:item.name,id:item.device_id,step:item.step_count,time:item.serv_receive,blood:item.blood_pres,heart:item.heart_rate};
							var temp = JSON.stringify(info);
							// console.log(temp);
							plus.storage.setItem("health",temp);}
						})
					}
			    }
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
