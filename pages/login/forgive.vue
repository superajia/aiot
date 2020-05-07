<template>
	<view class='page-white'>
		<view class="first">
			<view style="font-size:26rpx;width:136rpx;justify-content:center;" :class="{active1:active==0}">获取验证码</view>
			<view style="font-size:26rpx;width:136rpx;justify-content:center;" :class="{active1:active==1}">校验验证码</view>
			<view style="font-size:26rpx;width:136rpx;justify-content:center;" :class="{active1:active==2}">重设密码</view>
		</view>
		<view class="sec">
			<block v-if="active==0">
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-submit.png"></image></view>
				<view style="border-bottom:1px solid #aaa;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-circle.png"></image></view>
				<view style="border-bottom:1px solid #aaa;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-circle.png"></image></view>
			</block>
			<block v-if="active==1">
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-blue.png"></image></view>
				<view style="border-bottom:1px solid #007AFF;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-submit.png"></image></view>
				<view style="border-bottom:1px solid #aaa;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-circle.png"></image></view>
			</block>
			<block v-if="active==2">
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-blue.png"></image></view>
				<view style="border-bottom:1px solid #007AFF;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-blue.png"></image></view>
				<view style="border-bottom:1px solid #007AFF;flex:1 1 100rpx;"></view>
				<view class="circle">
					<image style="width:36rpx;height:36rpx" src="../../static/i-submit.png"></image></view>
			</block>
		</view>
		<block v-if="active==0">
			<view class="input-frame">
				<view class="icon0"><image src="../../static/i-tel.png" style="width:52rpx;height:52rpx"></image></view>
				<input class="my-input" type="number" placeholder="输入手机号码" name="tel" v-model="tel" /></view>
				<button class="login-btn" hover-class="hover" @tap="get">获取验证码</button>
		</block>
		
		<block v-if="active==1">
			<view class="input-frame">
				<view class="icon0"><image src="../../static/i-ver1.png" style="width:52rpx;height:52rpx"></image></view>
			    <input class="my-input" type="number" placeholder="输入验证码" name="ver" v-model="ver" /></view>
				<button class="login-btn" hover-class="hover" @tap="check">校验验证码</button>
		</block>
		
		<block v-if="active==2">
			<view class="input-frame">
				<view class="icon0"><image src="../../static/i-password.png" style="width:52rpx;height:52rpx"></image></view>
			    <input class="my-input" type="password" placeholder="重设密码" name="pass" v-model="pass" /></view>
				<button class="login-btn" hover-class="hover" @tap="reset">确定</button>
		</block>
	</view>
</template>
<script>
	import vuex from 'vuex'
	function isPoneAvailable(v) {
	    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	    if (!myreg.test(v)) {return false;
	    }else{return true;}
	}
	export default {
		data(){return{tel:"",url:"",ver:"",pass:"",active:0}},
		onLoad(option) {
			// console.log("load");
			this.url = option.url;
		}, 
		methods: {
			get(){
				var url = this.url;var tel = this.tel;var that = this;
				if(tel){
					if(isPoneAvailable(tel)){
						uni.request({
							url:url,method:"POST",data:{"what":"send_validation","phone":tel},
							success: (res) => {
								if (res.data.code==1000) {
									uni.showToast({title:"短信已发送,请稍等",icon:"none",duration:2000});that.active = 1;	
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
			},
			check(){
				var url = this.url;var ver = this.ver;var tel = this.tel;var that = this;
				if(ver){
					uni.request({
						url:url,method:"POST",data:{"what":"is_validation","phone":tel,"validation_code":ver},
						success: (res) => {
							if (res.data.code==1000) {
								uni.showToast({title:"验证码校验成功",icon:"none",duration:2000});that.active = 2;	
							}else{
								if(res.data.code){var error=res.data.error}else{var error = "错误码:"+res.statusCode};
								uni.showToast({title:error,icon:"none",duration:2000});
							}
						},fail: (res) => {uni.showToast({icon:'none',title:"请检查服务器地址或当前网络",duration:2000});},
					});
				}else{uni.showToast({title:"请输入验证码",icon:"none",duration:2000});}
			},
			reset(){
				var url = this.url;var pass = this.pass;var tel = this.tel;var that = this;
				if(pass){
					uni.request({
						url:url,method:"POST",data:{"what":"reset_password","phone":tel,"password":pass},
						success: (res) => {
							if (res.data.code==1000) {
								uni.showModal({title:'提示',content:"密码重设成功",showCancel:false,success:function(res){
                                    if (res.confirm) {uni.navigateBack({});}}});
							}else{
								if(res.data.code){var error=res.data.error}else{var error = "错误码:"+res.statusCode};
								uni.showToast({title:error,icon:"none",duration:2000});
							}
						},fail: (res) => {uni.showToast({icon:'none',title:"请检查服务器地址或当前网络",duration:2000});},
					});
				}else{uni.showToast({title:"请输入密码",icon:"none",duration:2000});}
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
.my-input{
	background: #e2f5fc;
	border-radius: 100upx;
	padding: 20upx 90upx;
	font-size: 36upx;
	letter-spacing:1rpx;
	align-items:center;
}
.input-frame{
	display:block;position:relative;margin:0 60rpx;
}
.login-btn{
	margin-top:70rpx;
	width:630upx;
	border: 0;
	border-radius: 100upx;
	font-size: 36upx;
}
.first{
	flex-direction:row;
	align-items:center;justify-content:space-between;
	padding:0 60rpx;margin:60rpx 0 20rpx;color:#808080;
}
.sec{
	flex-direction:row;
	align-items:center;justify-content:space-between;
	padding:0 90rpx;margin:20rpx 0 80rpx;color:#808080;
}
.circle{width:36rpx;height:36rpx;padding:0 8rpx;}
.active1{color:#007AFF}
</style>
