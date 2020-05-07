<template>
	<view class="page">
		<view class="my-header">情景模式设置<view style="border-bottom:2rpx solid #aaaaaa;width:30%"></view></view>
		<block v-if="type=='three'">
			<view class="my-frame">
				<view class="my-cell" :class="{active:1==i}" @tap="i=1"  hover-class="my-hover2" :hover-stay-time="100" :hover-start-time="100">
					<span class="iconfont icon-left" :class="{active1:1==i}" style="left:20rpx">&#xe63e;</span><view style="font-size:40rpx;">声音模式</view>
					<view>声音和震动</view>
				</view>
			</view>
			<view class="my-frame">
				<view class="my-cell" :class="{active:2==i}" @tap="i=2"  hover-class="my-hover2" :hover-stay-time="100" :hover-start-time="100">
					<span class="iconfont icon-left" :class="{active2:2==i}">&#xe6a0;</span><view style="font-size:40rpx;">响铃模式</view>
					<view>仅声音</view>
				</view>
			</view>
			<view class="my-frame">
				<view class="my-cell" :class="{active:3==i}" @tap="i=3" hover-class="my-hover2" :hover-stay-time="100" :hover-start-time="100">
					<span class="iconfont icon-left" :class="{active3:3==i}">&#xe61d;</span><view style="font-size:40rpx;">震动模式</view>
					<view>仅震动</view>
				</view>
			</view>
			<view class="my-frame">
				<view class="my-cell" :class="{active:4==i}" @tap="i=4" hover-class="my-hover2" :hover-stay-time="100" :hover-start-time="100">
					<span class="iconfont icon-left" :class="{active4:4==i}">&#xe61e;</span><view style="font-size:40rpx;">静音模式</view>
					<view>关闭声音和震动</view>
				</view>
			</view>
		</block>
		<block v-else>
			<radio-group @change="radioChange" class="my-frame" style="padding:10rpx 0;">
			    <label class="my-cell-big" style="display:flex;" v-for="(item, index) in list" :key="item.value">
			        <view style="font-size:38rpx;">{{item.name}}</view>
					<view style=""> <radio :value="item.value" :checked="item.checked" /> </view>
					
			    </label>
			</radio-group>
		</block>
		
		
		
	<view class="icon" @tap="send" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
		<image style="height:44px;width:44px" src="/static/i-work.png"></image>
	</view>
	<view class="my-header" style="color:#666;font-size:16px;">设置情景模式</view>	
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			var dev_type = this.$store.state.information.receive_port.slice(1,-1).split(',');
			if(dev_type[1]==" 'three'"){var type = "three"}else{var type = "jiai"}
			var order = this.$store.state.order;
			var list=[{name:"正常模式",value:1,checked:false},{name:"省电模式",value:2,checked:false},{name:"紧急模式",value:3,checked:false}]
			var i=1;
			if(order.work_model){i = Number(order.work_model)};
			list[i-1].checked = true;
			return {
				i,list,type, 
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		onLoad() {
			console.log("load"); 
		},
		methods:{
			radioChange(e){this.i = e.detail.value;},
			send(){this.req("work_model",this.i,"设置情景模式");},
			//下发指令的通用函数
			req(order,value,title){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						uni.showModal({title:title,content:res.data.data.msg,showCancel:false});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:title,content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
		},
		
	}
</script>

<style>
.icon-left{
	position:absolute;
	top:32rpx;
	left:26rpx; 
	color:#808080;
	line-height:1.5;
	font-size:40rpx;
}
.my-frame{margin:24rpx auto 0;}
.my-cell{color:#666;padding:26rpx 30rpx 26rpx 80rpx;opacity:0.6;}
.active{color:#000;opacity:1;}
.active1{color:#FF0000}
.active2{color:#FF9900}
.active3{color:#0099FF}
.active4{color:#009900}
.icon{
	width:260rpx;
	height:260rpx;
	margin:140rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
