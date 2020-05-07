<template>
	<form class='page'>
		<!-- <view class="my-header"><text class="my-header-content">SOS设置</text></view> -->
		<view class="my-before">当用户点击SOS按键时,会依次拨打下面三个号码:</view>
		<view class="my-frame" style="margin-top:0;padding-top:40rpx;">
			<view class="row" >
				<image class="img" src="/static/i-1.png"></image>
				<input class="my-input" type="number" placeholder-class="placeholder" maxlength="11" placeholder="请输入号码" name="sos1" v-model="vsos1"/>
			</view>
			<view class="row" >
				<image class="img" src="/static/i-2.png"></image>
				<input class="my-input" type="number" placeholder-class="placeholder" maxlength="11" placeholder="请输入号码" name="sos2" v-model="vsos2"/>
			</view>
			<view class="row" >
				<image class="img" src="/static/i-3.png"></image>
				<input class="my-input" type="number" placeholder-class="placeholder" maxlength="11" placeholder="请输入号码" name="sos3" v-model="vsos3"/>
			</view>
			<view></view>
		</view>
		<view class="my-before">开启后,上面三个号码会收到SOS短信</view>
		<view class="my-frame-little">
			<view class="my-cell">
				<view>开关SOS短信</view>
				<!-- <switch  :checked="index[key]" @change="open($event,key)"/> -->
				<switch  :checked="vopen" @change="open"/>
			</view>
		</view>
		
	
		<button style="margin-top:160rpx;" hover-class="hover" formType="submit" @tap="send">提交</button>
	</form>
</template>
<script>
	export default {
		data() {
			var order = this.$store.state.order;
			var vsos1 ='',vsos2 ='',vsos3 ='',vopen =false;
			if(order){
				vsos1 = order.sos1;
				vsos2 = order.sos2;
				vsos3 = order.sos3;
				vopen = Boolean(Number(order.sosmsg_to_phone));
			}
			return {
				vsos1,
				vsos2,
				vsos3,
				vopen,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				// url:'http://192.168.0.1:8000',
				token:this.$store.state.logindata.token,
			}
		},
		onLoad( ) {
			console.log("load");
		},
		methods:{  
			open(e){this.vopen = e.detail.value;this.reqmsg("sosmsg_to_phone",Number(this.vopen));},
			send(){
				var that = this;
				this.reqnum("sos1",this.vsos1);
				setTimeout(function(){that.reqnone("sos2",that.vsos2);},100);
				setTimeout(function(){that.reqnone("sos3",that.vsos3);},200);
				 
			},
			reqmsg(order,value){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showModal({title:'开关SOS短信',content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:'设置SOS号码',content:"指令发送失败,"+error,showCancel:false});
					}
				},
				fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			reqnum(order,value){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				// console.log(data);
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				    success: (res) => {
				    	// console.log(res);
				    	if (res.data.code == 1000) {
				    		uni.showModal({title:'设置SOS号码',content:res.data.data.msg,showCancel:false});
				    	}else{
				    		console.log(res);var error = "错误码:"+res.statusCode;
				    		if(res.data.code){error=res.data.error};
				    		uni.showModal({title:'设置SOS号码',content:"指令发送失败,"+error,showCancel:false});
				    	}
				    },
				    fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				})
			},
			reqnone(order,value){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,});
			}
		}
	}
</script>

<style>
.row{
	margin:0 0 40rpx;
	padding:0 25rpx 0 90rpx;
	position:relative;
}

.img{
	width:30px;
	height:30px;
	position:absolute;
	left:16rpx;
	top:16rpx;
}
.my-input{
	background: #e2f5fc;
	width:100%;
	border-radius: 16upx;
	padding: 20upx 40upx;
	font-size: 20px;
	letter-spacing:0.5px;
}
</style>
