<template>
	<form class='page-white'>
		<view class=""><image src="/static/96x96.png" style="width:200rpx;height:200rpx;margin:40rpx auto 30rpx;"></image></view>
			<view style="display:block;position:relative;">
				<view class="icon0"><image src="../../static/i-username.png" style="width:52rpx;height:52rpx"></image></view>
				<input class="my-input" type="text" placeholder="请输入用户名" name="user" v-model="userName" /></view>
			<view style="display:block;position:relative;">
				<view class="icon0"><image src="../../static/i-password.png" style="width:52rpx;height:52rpx"></image></view>
			    <input class="my-input" type="password" placeholder="请输入密码" name="pass" v-model="passWord" /></view>
			
			<view style="position:absolute;top:20rpx;right:20rpx" @tap="tapurl"><span class="iconfont icon-right">&#xe609;</span></view>
	
			<button type="" class="login-btn" hover-class="hover" formType="submit" @tap="login">登录</button>
			
			<view class="forgive" >
				<view class="mini-btn" @tap="register" hover-class="click-class" :hover-stay-time="50" :hover-start-time="0">我要注册</view>
				<view class="mini-btn" @tap="forgive" hover-class="click-class" :hover-stay-time="50" :hover-start-time="0">忘记密码?</view>
			</view>
			
			<!-- 设置服务器地址的蒙层 -->
			<view class="my-mask" v-if="isshowurl">
				<view class="wrap1">
				    <view class="my-cell-top">服务器配置</view>
					<radio-group style="display:flex;margin:0 auto 20rpx;justify-content:space-around;" @change="changehttp">
						<label class="radio"><radio :checked="http=='http'" value="http" />http</label>
						<label class="radio"><radio :checked="http=='https'" value="https" />https</label>
					</radio-group>
				    <input class="my-input2" type="text" placeholder="请输入服务器地址"  name="url" v-model="showurl"/>
				    <view class="my-cell">
				    	<view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="isshowurl=false">取消</view>
				    	<view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm">确定</view>
				    </view>
				</view>
			</view>
	</form>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data(){
			var http = "https"
			if(uni.getStorageSync('http')){
			    http = uni.getStorageSync('http');
			}
			return{
			    userName: "",
			    passWord: "",
				url:"略",
				isshowurl:false,
				showurl:"",
				http:http,
				}
		},
		onLoad(option) {
			// console.log("load");
			//如果是退出登录的,从本地存储中获取登录必要参数而不主动登录  或者判断本地存储中的登录参数是否有数据，有的话获取登录参数主动登录，没有的话算了
			let that = this;
			if(option.username){
				that.userName = uni.getStorageSync('userName');that.passWord = uni.getStorageSync('passWord');
				that.url = uni.getStorageSync('url');that.http = uni.getStorageSync('http');
			}else{
				var temp_userName = uni.getStorageSync('userName');var temp_passWord = uni.getStorageSync('passWord');
				var temp_url = uni.getStorageSync('url');var temp_http = uni.getStorageSync('http');
				if(temp_userName&&temp_passWord&&temp_url&&temp_http) {
					that.userName = temp_userName;that.passWord = temp_passWord;
					that.url = temp_url;that.http = temp_http; 
					that.login();
				}
			};
		}, 
		methods: {
			changehttp:function(e){this.http = e.detail.value;},
			tapurl(){this.showurl=this.url;this.isshowurl = true;},
			confirm(e){this.url = this.showurl;this.isshowurl = false;},
			login() {
				//校验账号密码
				if (!this.userName) {
					uni.showToast({icon: 'none',title: '请输入用户名'});return;
				} else if (!this.passWord) {
					uni.showToast({icon: 'none',title: '请输入密码'});return;
				} else if (!this.url||!this.http) {
					uni.showToast({icon: 'none',title: '请设置服务器地址'});return;
				}
				plus.nativeUI.showWaiting();
				var data = {"username":this.userName,"password":this.passWord};
				uni.setStorageSync('userName', this.userName);
				uni.setStorageSync('passWord', this.passWord);
				uni.setStorageSync('url', this.url);uni.setStorageSync('http', this.http);
				this.req(this.url,this.http,data);
			},
			req(url,http,data){
				uni.request({
					url:http+"://"+url+":8089/logins/",method: "POST",data:{user:data},
					success: (res) => {
						plus.nativeUI.closeWaiting();
						if (res.data.code==1000) {
							// console.log(http+"://"+url+":8089/logins/");
							// console.log(data);
							this.$store.commit('setlogindata',res.data.data);
							this.$store.commit('seturl',http+"://"+url+":8089");
							uni.switchTab({url:'/pages/home/home'});	
						}else{
							// console.log(res);
							var error = "请求失败";
							if(res.data.code){error=res.data.error
							}else{error = "错误码:"+res.statusCode};
							uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail: (res) => {plus.nativeUI.closeWaiting();uni.showToast({icon:'none',title: "请检查服务器地址或当前网络",duration:2000});},
				});
			},
			register(){
				if(this.url&&this.http){
					uni.navigateTo({url:'register'+"?url="+this.http+'://'+this.url+':8089/registered/'})
				}else{
					uni.showToast({title:"请先设置服务器地址",icon:"none",duration:2000});
				}
			}, 
			forgive(){
				if(this.url&&this.http){
					uni.navigateTo({url:'forgive'+"?url="+this.http+'://'+this.url+':8089/retrieve_password/'})
				}else{
					uni.showToast({title:"请先设置服务器地址",icon:"none",duration:2000});
				}
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
.icon-right{
	color:#808080;
	line-height:1.3;
	font-size:48rpx;
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
	background: #efefef;
	margin:0 30rpx;
	border-radius: 16upx;
	padding: 20rpx 40upx;
	font-size: 19px;
	letter-spacing:1rpx;
}
.login-btn{
	margin-top:100rpx;
	width:630upx;
	border: 0;
	border-radius: 100upx;
	font-size: 36upx;
}
.wrap1{
	width:680rpx;
	height:420rpx;
	margin:400rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px; 
	overflow: hidden;
	position:relative;
}
.forgive{
	padding:50rpx 20rpx 0;
	flex-direction:row;justify-content:space-between;
}
.mini-btn{
	color:#666;
	padding:4rpx 14rpx;
	/* font-size:32rpx; */
}
.click-class{color:#0099FF}
</style>
