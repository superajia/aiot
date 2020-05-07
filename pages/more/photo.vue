<template>
	<view class="page">
	    <view class="my-frame-little" style="margin-top:24rpx;padding:10rpx 0;">
	    	<view class="my-cell">
	    		<view>设备名称</view><view style="color:#808080;">{{infor.name}}</view></view>
			<view class="my-cell">
				<view>设备id</view><view style="color:#808080;">{{infor.device_id}}</view></view>
	    </view>
		<view class="icon" @tap="send" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
	    	<image style="height:44px;width:44px" src="/static/i-camera.png"></image>
	    </view>
	    <view class="my-header" style="color:#666;font-size:16px;">点击按钮，控制设备远程拍照</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		onLoad() {
			console.log("load");
		},
		methods:{
			send(){
				var that =this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"photograph","set_value":"0"}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000) {
						uni.showModal({title:"远程拍照",content:res.data.data.msg,showCancel:false});
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:"远程拍照",content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});}
				});
			}
		}
	}
</script>

<style>
.icon{
	width:260rpx;
	height:260rpx;
	margin:400rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
