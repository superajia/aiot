<template>
	<view class="page">
        <view class="my-header">为设备设置闹钟<view style="border-bottom:2rpx solid #aaaaaa;width:30%"></view></view>    
		
		<!-- 闹钟框架 -->
		<view class="my-frame"  v-for="(item,i) in list" :key="i">
			<!-- 闹钟单元 -->
			<view class="my-cell"> 
				<!-- 左边——设置闹钟 -->
				<view :class="{active:color[i]}" @tap="selectclock(i)">
					<image style="width:42px;height:42px;" src="/static/i-clock.png"></image>
					<view style="font-size:48rpx;line-height:1.2;padding-left:10rpx;flex-direction:column;">{{item.time}}<text style="font-size:28rpx;line-height:1.2;">{{item.times}}</text></view>
					<!-- <view style="font-size:28rpx;color:#808080;line-height:1.2;background-color:#eeeeee;"></view> -->
				</view>
				<!-- 右边——切换开关 -->
				<switch  :checked="item.status" @change="openclock($event,i)"/>
			</view>
		</view>
		<!-- 设置闹钟的蒙层 -->
		<view class="my-mask" v-if="showmask">
			<view class="wrapp">
				<view class="my-cell-top">闹钟设置</view> 
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
			    <picker-view indicator-class="mid" style="height:300rpx;" :value="initvalue"  @change="changeclock">
			        <picker-view-column>
			            <view class="item1" v-for="i in hours" :key="i">{{i}}<text style="font-size:40rpx;padding:10rpx 0 0 20rpx;">时</text></view></picker-view-column>
			        <picker-view-column>
			            <view class="item2" v-for="i in minutes" :key="i">{{i}}<text style="font-size:40rpx;padding:10rpx 0 0 20rpx;">分</text></view></picker-view-column>
			    </picker-view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
				<radio-group style="display:flex;margin:20rpx auto;justify-content:space-around;" @change="changetimes">
					<label class="radio"><radio value="一次" :checked="'一次' == inittimes"/>一次</label>
					<label class="radio"><radio value="每天" :checked="'每天' == inittimes"/>每天</label>
					<label class="radio"><radio value="周一至周五" :checked="'周一至周五' == inittimes"/>周一至周五</label>
				</radio-group>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="cancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm">确定</view>
				</view>
			</view>
		</view>
		<view class="icon" @tap="send" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
			<image style="height:44px;width:44px" src="/static/i-clock.png"></image>
		</view>
		<view class="my-header" style="color:#666;font-size:16px;">设置闹钟</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			var hours =   ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
			var minutes = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];
			var order = this.$store.state.order;
			var list = [{time:"00:00",status:false,times:"一次"},{time:"00:01",status:false,times:"每天"},{time:"00:02",status:false,times:"周一至周五"}];
			var color = [false,false,false];
			//处理闹钟初始值，将字符串变为数字，对象形式
			if(order.time_remind){
				list = [],color = [];
				var first_data = order.time_remind.split(',');
				var sec_data = [0,1,2];
				sec_data[0] = first_data[0].split('-');
				sec_data[1] = first_data[1].split('-');
				sec_data[2] = first_data[2].split('-');
				for(var i=0;i<3;i++){
					var time = sec_data[i][0];
					var status = Boolean(Number(sec_data[i][1]));
					var times = "";
					if(sec_data[i][2]=="1"){times="一次"}else if(sec_data[i][2]=="2"){times="每天"}else{times="周一至周五"};
					list.push({time:time,status:status,times:times});
					color.push(status)
			}   }
			return {
				list,hours,minutes,color,
				time:'',
				times:'',
				
				i:0,
				showmask:false,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		}, 
		computed:{
			//闹钟设置 时间初始值，随闹钟显示时间改变而改变
			initvalue(){var v = this.list[this.i].time;var value = [Number(v.slice(0,2)),Number(v.slice(3,5))];return value;},
			//闹钟设置 频率初始值，随闹钟显示频率改变而改变
			inittimes(){var v = this.list[this.i].times;return v;}
		},
		onLoad() {
			console.log("load"); 
		},
		methods: {
			//开关闹钟  选中的闹钟状态为开 颜色高亮
			openclock(e,i){this.$set(this.list[i],"status",e.detail.value);this.$set(this.color,i,e.detail.value);},
			//打开蒙版 改变当前的i
			selectclock(i){
				this.time = this.list[i].time;
				this.times = this.list[i].times;
				this.i = i;this.showmask = true;},
			changetimes:function(e){const val = e.detail.value;this.times = val;},
			changeclock: function (e) {const val = e.detail.value;this.time = this.hours[val[0]]+":"+this.minutes[val[1]];},
			cancel(){this.showmask=false;console.log(this.showmask)},
			confirm(){
			this.showmask=false;
			this.$set(this.list[this.i],"time",this.time);
			this.$set(this.list[this.i],"times",this.times);
			},
			
			send(){
				var that = this;
				var title ="闹钟设置";
				var str = [];
				for(var i=0;i<3;i++){
					var time = that.list[i].time;
					var status = Number(that.list[i].status);
					var times = "";
					if(that.list[i].times=="一次"){times="1"}else if(that.list[i].times=="每天"){times="2"}else{times="3-0111110"};
					str.push(time+'-'+status+'-'+times);
				}   
				var value = str[0]+","+str[1]+","+str[2];
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"time_remind","set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000) {
						uni.showModal({title:title,content:res.data.data.msg,showCancel:false});
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:title,content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});}
				});
				
			}
		},
		onUnload(){
			console.log("unload");
		}
	}
</script>
<style>
.my-frame{padding:8rpx 0}
.my-cell{letter-spacing:1rpx;color:#808080;padding:16rpx 30rpx;}
.active{color:#333333;font-weight:700;}

.wrapp{
	width:680rpx;
	height:648rpx;
	margin:300rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px; 
	overflow: hidden;
}
.item1,.item2{
	align-items:center;
	justify-content: center;
	font-size:56rpx;
	height:56px;
	background-color:#E9ECEF;
}
.item1{padding-left:60rpx;}
.item2{padding-right:100rpx;}
.mid{height:100rpx;}


.icon{
	width:260rpx;
	height:260rpx;
	margin:200rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
	/* color:#606060; */
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
