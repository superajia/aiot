<template>
	<form class='page-white'>
			<view style="display:block;position:relative;margin-top:100rpx;">
				<view class="icon0"><image src="../../static/i-tel.png" style="width:52rpx;height:52rpx"></image></view>
				<input class="my-input" type="number" placeholder="手机号码" name="tel" v-model="tel" /></view>
			<view style="display:block;position:relative;">
				<view class="icon0"><image src="../../static/i-ver1.png" style="width:52rpx;height:52rpx"></image></view>
				<view class="mini-btn"  @tap="get" hover-class="click-class" :hover-stay-time="50" :hover-start-time="0">获取验证码</view>
			    <input class="my-input2" type="number" placeholder="验证码" name="ver" v-model="ver" />
			</view>
			<view style="display:block;position:relative;">
				<view class="icon0"><image src="../../static/i-password.png" style="width:52rpx;height:52rpx"></image></view>
			    <input class="my-input" type="password" placeholder="登录密码" name="pass" v-model="pass" /></view>
			<!-- <view style="display:block;position:relative;">
				<view class="icon0"><image src="../../static/i-password.png" style="width:52rpx;height:52rpx"></image></view>
				<input class="my-input" type="password" placeholder="请确认密码" name="pass" v-model="passWord" /></view> -->
			
	
			<button type="" class="login-btn" hover-class="hover" formType="submit" @tap="register">立即注册</button>
	</form>
</template>
<script>
	import vuex from 'vuex'
	function isPoneAvailable(v) {
	    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	    if (!myreg.test(v)) {return false;
	    }else{return true;}
	}
	export default {
		data(){return{tel:"",url:"",ver:"",pass:""}},
		onLoad(option) {
			console.log("load");
			this.url = option.url;
		}, 
		methods: {
			register() {
				//校验手机号，验证码，登录密码
				var url = this.url;var tel = this.tel;
				if(!tel){uni.showToast({title:"请输入手机号码",icon:"none",duration:2000});return;};
				if(!isPoneAvailable(tel)){uni.showToast({title:"手机号码格式不对",icon:"none",duration:2000});return;};
				if(!this.ver){uni.showToast({title:"请输入验证码",icon:"none",duration:2000});return;};
				if(!this.pass){uni.showToast({title:"请输入登录密码",icon:"none",duration:2000});return;};
				// if(this.passwd2==this.passwd1){uni.showToast({title:"旧密码和新密码不能相同!",icon:"none",duration:2000});return;};
				
				var data = {"what":'registered',"phone":tel,"password":this.pass,"validation":this.ver,};
				uni.request({
					url:url,method: "POST",data:data,
					success: (res) => {
						if (res.data.code==1000) {
							uni.showToast({title:"注册成功",icon:"none",duration:2000});	
						}else{
							if(res.data.code){var error=res.data.error}else{var error = "错误码:"+res.statusCode};
							uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail: (res) => {uni.showToast({icon:'none',title:"请检查服务器地址或当前网络",duration:2000});},
				});
			},
			get(){
				var url = this.url;var tel = this.tel;
				if(tel){
					if(isPoneAvailable(tel)){
						uni.request({
							url:url,method:"POST",data:{"what":'validation',"phone":tel},
							success: (res) => {
								if (res.data.code==1000) {
									uni.showToast({title:"短信已发送,请稍等",icon:"none",duration:2000});	
								}else{
									if(res.data.code){var error=res.data.error}else{var error = "错误码:"+res.statusCode};
									uni.showToast({title:error,icon:"none",duration:2000});
								}
							},
							fail: (res) => {uni.showToast({icon:'none',title:"请检查服务器地址或当前网络",duration:2000});},
						});
						
					}else{
						uni.showToast({title:"手机号码格式不对",icon:"none",duration:2000});
					}
				}else{uni.showToast({title:"请输入手机号码",icon:"none",duration:2000});}
			}
		}
	}
</script>
<style>
.icon0{
	position:absolute;
	top:20rpx;
	left:26rpx;
}
.mini-btn{
	position:absolute;
	top:16rpx;
	right:10rpx;
	color:#007AFF;
	padding:4rpx 14rpx;
}
.page-white{
	box-sizing: border-box;
	padding:0 60rpx;
}
.my-input{
	/* height: 60rpx; */
	background: #e2f5fc;
	margin-top: 40upx;
	border-radius: 100upx;
	padding: 20upx 90upx;
	font-size: 36upx;
	letter-spacing:1rpx;
}
.my-input2{
	background: #e2f5fc;
	margin-top: 40upx;
	border-radius: 100upx;
	padding: 20upx 90upx;
	font-size: 36upx;
	margin-right:240rpx;
	letter-spacing:1rpx;
}
.login-btn{
	margin-top:90rpx;
	width:630upx;
	border: 0;
	border-radius: 100upx;
	font-size: 36upx;
}
.click-class{
	color:#333;
}
</style>
