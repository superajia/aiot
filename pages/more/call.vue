<template>
	<view class="page">
		<view class="my-frame-little" style="margin-top:24rpx;">
		    <view class="my-cell">
				<input class="my-input" type="number" placeholder-class="placeholder" maxlength="11" placeholder="请输入号码" name="num" v-model="vnum"/>
		    </view>
		</view>
		
		<view class="icon" @tap="send" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
			<image style="height:44px;width:44px" src="/static/i-call.png"></image>
		</view>
		<view class="my-header" style="color:#666;font-size:16px;">拨打电话：远程控制设备拨打上面输入的号码</view>
		<view class="icon" @tap="sendmid" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
			<image style="height:44px;width:44px" src="/static/i-listen.png"></image>
		</view>
		<view class="my-header" style="color:#666;font-size:16px;">语音监护：接听设备的来电，实现监护</view>
	
	
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			var order = this.$store.state.order;
			var center_num ='';
			if(order){
				if(order.center_num_set){center_num = order.center_num_set;};
			}
			return {
				vnum:"",
				center_num,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		methods:{
			sendmid(){
				var that =this;
				if(!this.center_num){uni.showToast({title:"没有中心号码,请到通知管理中设置",icon:"none",duration:3000});return;}
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"monitor","set_value":""}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000) {
						uni.showModal({title:"一键监听",content:res.data.data.msg,showCancel:false});
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:"一键监听",content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});}
				});
			},
			send(){
				var that =this;
				if(!this.vnum){uni.showToast({title:"请先输入号码",icon:"none",duration:3000});return}
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"phone_call","set_value":that.vnum}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000) {
						uni.showModal({title:"拨打电话",content:res.data.data.msg,showCancel:false});
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:"拨打电话",content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});}
				});
			}
		},
		onLoad() {
			console.log("load");
		}
	}
</script>

<style>
	.icon{
		width:260rpx;
		height:260rpx;
		margin:140rpx auto 10rpx;
		border-radius:50%; 
		border:0.6px solid #aaa;
		justify-content:center;
		align-items:center;
		background-color:#fff;
		/* color:#606060; */
	}


.my-input{
	background:#e2f5fc;
	width:600rpx;
	margin:0;
	border-radius: 12upx;
	padding: 20rpx 40upx;
	font-size: 19px;
	letter-spacing:0.5px;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
