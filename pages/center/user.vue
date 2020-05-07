<template>
	<view class="page">
		<view class="my-para">
			<view class="my-cell">
				<text>帐号</text><view style="padding-right:8rpx;">{{username}}</view></view>
			<view class="my-line"></view>
			<!-- <view class="my-cell" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goset">
                <text>昵称</text><view style="color:#808080;padding-right:28rpx;">{{hehe}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-line"></view>
			
			<view class="my-cell" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="goreact">
				<text>邮箱</text><view style="color:#808080;padding-right:28rpx;">{{hehe}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-line"></view> -->
			<view class="my-cell" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @tap="open">
				<text>修改密码</text><span class="iconfont icon-right">&#xe61b;</span></view></view>
			<!-- 设置中心号码的蒙层 -->
			<view class="my-mask" v-if="isshow">
				<view class="wrap1">
				    <view class="my-cell-top">修改密码</view>
				    <input class="my-input" password placeholder-class="placeholder" placeholder="请输入旧密码" name="name1" v-model="passwd1"/>
					<input style="margin-top:30rpx;" class="my-input" password placeholder-class="placeholder" placeholder="请输入新密码" name="name2" v-model="passwd2"/>
				    <view class="my-cell">
				    	<view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="isshow=false">取消</view>
				    	<view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm">确定</view>
				    </view>
				</view>
			</view>
	</view>
</template>
<script>
	export default {
		data(){
			return{
				isshow:false,
				passwd1:"",
				passwd2:""
			}
		},	
		computed: {
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
			username(){return this.$store.state.logindata.username}
		},
		onLoad(){
			
			// console.log(this.$store.state.logindata);
		},
		methods: {
			open(){
				if(this.username=="admin"){uni.showToast({title:"admin不能修改密码",icon:"none",duration:2000});return;}
				this.isshow=true;
			},
			confirm(){
				if(!this.passwd1){uni.showToast({title:"旧密码不能为空!",icon:"none",duration:2000});return;};
				if(!this.passwd2){uni.showToast({title:"新密码不能为空!",icon:"none",duration:2000});return;};
				if(this.passwd2==this.passwd1){uni.showToast({title:"旧密码和新密码不能相同!",icon:"none",duration:2000});return;};
				this.isshow=false;
				var that=this;
				uni.request({url:this.url +"/set_password/",method:"POST",header:{"authorization": that.token},
				data:{"old_password":that.passwd1,"new_password":that.passwd2},sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showModal({title:"密码修改",content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000})
					}
				},
				fail: (res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			}
		}
	}
</script>
<style>
.my-cell{
	padding-left:42rpx;
}
.icon-right{
	position:absolute;
	top:24rpx;
	right:20rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;	
}
.wrap1{
	width:680rpx;
	height:464rpx;
	margin:260rpx 35rpx;
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
