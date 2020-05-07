<template>
	<view class="page">
		<view class="my-before">开启计步功能</view>
	    <view class="my-frame-little">
	    	<view class="my-cell"> 
	    		<view>开启计步</view><switch  :checked="isshowwalk" @change="openwalk"/></view>
	    	<view class="my-cell" v-if="isshowwalk" @tap="isshowstarttime=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
	    		<view>开始时间</view><view style="color:#808080;width:150rpx;justify-content:flex-end;padding-right:24rpx;">{{starttime}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
	    	<view class="my-cell" v-if="isshowwalk"  @tap="isshowendtime=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
	    		<view>结束时间</view><view style="color:#808080;width:150rpx;justify-content:flex-end;padding-right:24rpx;">{{endtime}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
	    </view>
		<view class="my-before">开启勿扰模式(周一至周五此时间段拒收任何来电)</view>
		<view class="my-frame-little">
			<view class="my-cell"> 
				<view>勿扰模式</view><switch  :checked="true" @change="openrelax"/></view>
			<view class="my-cell" v-if="isshowrelax" @tap="isshowstarttime1=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>开始时间</view><view style="color:#808080;padding-right:24rpx;">{{starttime1}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-cell" v-if="isshowrelax" @tap="isshowendtime1=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>结束时间</view><view style="color:#808080;padding-right:24rpx;">{{endtime1}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
		</view>
		<!-- 设置勿扰模式开始时间的蒙层 -->
		<view class="my-mask" v-if="isshowstarttime1">
			<view class="wrap">
				<view class="my-cell-top">开始时间</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
			    <picker-view indicator-class="mid" style="height:300rpx;" :value="startvalueindex1"  @change="setstarttime1">
			        <picker-view-column>
			            <view class="item1" v-for="i in hours" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">时</text></view></picker-view-column>
			        <picker-view-column>
			            <view class="item2" v-for="i in minutes" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">分</text></view></picker-view-column>
			    </picker-view>
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="startcancel1">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="startconfirm1">确定</view>
				</view>
			</view>
		</view>
		<!-- 设置勿扰模式结束时间的蒙层 -->
		<view class="my-mask" v-if="isshowendtime1">
			<view class="wrap">
				<view class="my-cell-top">结束时间</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
			    <picker-view indicator-class="mid" style="height:300rpx;" :value="endvalueindex1"  @change="setendtime1">
			        <picker-view-column>
			            <view class="item1" v-for="i in hours" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">时</text></view></picker-view-column>
			        <picker-view-column>
			            <view class="item2" v-for="i in minutes" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">分</text></view></picker-view-column>
			    </picker-view>
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="endcancel1">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="endconfirm1">确定发送</view>
				</view>
			</view>
		</view>
		<!-- 设置计步功能开始时间的蒙层 -->
		<view class="my-mask" v-if="isshowstarttime">
			<view class="wrap">
				<view class="my-cell-top">开始时间</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
			    <picker-view indicator-class="mid" style="height:300rpx;" :value="startvalueindex"  @change="setstarttime">
			        <picker-view-column>
			            <view class="item1" v-for="i in hours" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">时</text></view></picker-view-column>
			        <picker-view-column>
			            <view class="item2" v-for="i in minutes" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">分</text></view></picker-view-column>
			    </picker-view>
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="startcancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="startconfirm">确定</view>
				</view>
			</view>
		</view>
		<!-- 设置计步功能结束时间的蒙层 -->
		<view class="my-mask" v-if="isshowendtime">
			<view class="wrap">
				<view class="my-cell-top">结束时间</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
			    <picker-view indicator-class="mid" style="height:300rpx;" :value="endvalueindex"  @change="setendtime">
			        <picker-view-column>
			            <view class="item1" v-for="i in hours" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">时</text></view></picker-view-column>
			        <picker-view-column>
			            <view class="item2" v-for="i in minutes" :key="i">{{i}}<text style="font-size:38rpx;padding:10rpx 0 0 20rpx;">分</text></view></picker-view-column>
			    </picker-view>
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="endcancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="endconfirm">确定发送</view>
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	
	export default {
		data() {
			var hours =   ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
			var minutes = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];
			var v_walk="08:00-20:00",isshowwalk=true,v_relax="22:00-07:00",isshowrelax=true;
			var order = this.$store.state.order;
			if(order){
				if(order.step_cunt_btn){isshowwalk = Boolean(Number(order.step_cunt_btn))};
				if(order.walk_time_set){v_walk=order.walk_time_set};
				
				if(order.silence_time_set){v_relax=order.silence_time_set};
			};
			var startvalueindex = [Number(v_walk.slice(0,2)),Number(v_walk.slice(3,5))];
			var endvalueindex = [Number(v_walk.slice(6,8)),Number(v_walk.slice(9,11))];
			var starttimeindex = [Number(v_walk.slice(0,2)),Number(v_walk.slice(3,5))];
			var endtimeindex = [Number(v_walk.slice(6,8)),Number(v_walk.slice(9,11))];
			var startvalueindex1 = [Number(v_relax.slice(0,2)),Number(v_relax.slice(3,5))];
			var endvalueindex1 = [Number(v_relax.slice(6,8)),Number(v_relax.slice(9,11))];
			var starttimeindex1 = [Number(v_relax.slice(0,2)),Number(v_relax.slice(3,5))];
			var endtimeindex1 = [Number(v_relax.slice(6,8)),Number(v_relax.slice(9,11))];
			return {
				startvalueindex,endvalueindex,starttimeindex,endtimeindex,hours,minutes,
				startvalueindex1,endvalueindex1,starttimeindex1,endtimeindex1,
				i:0,
				isshowwalk,isshowrelax,
				isshowstarttime:false,
				isshowendtime:false,
				isshowstarttime1:false,
				isshowendtime1:false,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		computed:{
			//显示的开始时间
			starttime(){return this.hours[this.starttimeindex[0]]+":"+this.minutes[this.starttimeindex[1]]},
			//显示的结束时间
			endtime(){return this.hours[this.endtimeindex[0]]+":"+this.minutes[this.endtimeindex[1]]},
			
			//显示的开始时间
			starttime1(){return this.hours[this.starttimeindex1[0]]+":"+this.minutes[this.starttimeindex1[1]]},
			//显示的结束时间
			endtime1(){return this.hours[this.endtimeindex1[0]]+":"+this.minutes[this.endtimeindex1[1]]},
		},
		onLoad() {
			console.log("load");
		},
		methods:{
			setstarttime1(e){const v = e.detail.value;this.startvalueindex1 = [v[0],v[1]];},
			startconfirm1(){this.starttimeindex1 = this.startvalueindex1;this.isshowstarttime1 = false;},
			startcancel1(){this.startvalueindex1 = this.starttimeindex1;this.isshowstarttime1 = false;},
			setendtime1(e){const v = e.detail.value;this.endvalueindex1 = [v[0],v[1]];},
			endcancel1(){this.endvalueindex1 = this.endtimeindex1;this.isshowendtime1 = false;},
			endconfirm1(){
				this.endtimeindex1 = this.endvalueindex1;
				var v = this.starttime1 +"-"+this.endtime1;
				this.isshowendtime1 = false;
				this.req("silence_time_set",v,"勿扰模式设置");
			},
			//开关 开始时间和结束时间 的面板;如果是关闭的, 下发关闭勿扰模式指令
			openrelax(e){
				this.isshowrelax = e.detail.value;
				if(!this.isshowrelax){this.req("silence_time_set","00:00-00:00","勿扰模式设置");}
			},
			
			
			//从picker的改变值 获取 设置的开始时间的索引
			setstarttime(e){const v = e.detail.value;this.startvalueindex = [v[0],v[1]];},
			//确定:将设置的开始时间的索引==>显示的开始时间的索引
			startconfirm(){this.starttimeindex = this.startvalueindex;this.isshowstarttime = false;},
			//取消:将显示的开始时间的索引==>设置的开始时间的索引
			startcancel(){this.startvalueindex = this.starttimeindex;this.isshowstarttime = false;},
			//从picker的改变值 获取 设置的结束时间的索引
			setendtime(e){const v = e.detail.value;this.endvalueindex = [v[0],v[1]];},
			//取消:将显示的结束时间的索引==>设置的结束时间的索引
			endcancel(){this.endvalueindex = this.endtimeindex;this.isshowendtime = false;},
			//确定:将设置的结束时间的索引==>显示的结束时间的索引 , 并获取显示的开始时间 和 显示的结束时间 , 下发计步功能指令
			endconfirm(){
				var that = this;
				this.endtimeindex = this.endvalueindex;
				var v = this.starttime +"-"+this.endtime;
				this.isshowendtime = false;
				this.req("walk_time_set",v,"计步功能开启");
			},
			//开关 开始时间和结束时间 的面板;如果是关闭的, 下发关闭计步功能指令
			openwalk(e){
				this.isshowwalk = e.detail.value;
				if(this.isshowwalk){this.reqnone("step_cunt_btn",1);}
				if(!this.isshowwalk){this.req("step_cunt_btn",0,"计步功能关闭");}
			},
			
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
						uni.showModal({title:title,content:"指令发送失败,"+error,showCancel:false});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}) },
				});
			},
			//下发无消息提醒的命令
			reqnone(order,value){
				var data = {"param_data":{"device_id":this.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,});
			}
		},
	}
</script>

<style>
.my-frame-little{margin-bottom:10rpx;}
.icon-right{
	position:absolute;
	top:22rpx;
	right:16rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;
}
.wrap{
	width:680rpx;
	height:554rpx;
	margin:300rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px; 
}
.item1,.item2,.item{
	align-items:center;
	justify-content: center;
	font-size:56rpx;
	height:56px;
	background-color:#E9ECEF;
}
.item1{padding-left:60rpx;}
.item2{padding-right:100rpx;}
.mid{height:100rpx;}
</style>
