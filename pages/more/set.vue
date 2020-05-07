<template>
	<view class="page">
		<view class="my-before">设备每隔多久上传一次数据</view>
		<view class="my-frame-little">
			<view class="my-cell-big" @tap="openshowtimes(0)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>数据上传频率</view><view style="color:#808080;padding-right:24rpx;">{{send_rate}}</view><span class="iconfont icon-right1">&#xe61b;</span></view></view>
		<view class="my-before">设备每隔多久上传一次健康数据(心率,血压)</view>
		<view class="my-frame-little">
			<view class="my-cell-big" @tap="openshowtimes(1)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>健康数据上传频率</view><view style="color:#808080;padding-right:24rpx;">{{health_rate}}</view><span class="iconfont icon-right1">&#xe61b;</span></view></view>
		
		<view class="my-before">其他设置</view>
		<view class="my-frame-little" style="padding:10rpx 0;">
			<view class="my-cell" @tap="language" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>语言和时区</view><view style="color:#808080;padding-right:24rpx;">{{time_language}}</view><span class="iconfont icon-right2">&#xe61b;</span></view>
			<view class="my-cell" @tap="version" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>设备版本信息</view><span class="iconfont icon-right2">&#xe61b;</span></view>
			<view class="my-cell" @tap="isshowreback=true" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>恢复出厂设置</view><span class="iconfont icon-right2">&#xe61b;</span></view></view>
		
		<!-- 数据上传频率公用蒙层 -->
		<view class="my-mask" v-if="isshowtimes">
			<view class="wrap">
				<view class="my-cell-top">{{title}}</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
				<block v-if="0==i">
					<picker-view indicator-class="mid" style="height:300rpx;" :value="send_rate_index"  @change="set_rate">
						<picker-view-column>
							<view class="item" v-for="i in send_rate_list" :key="i">{{i}}</view></picker-view-column></picker-view></block>
				<block v-else>
					<picker-view indicator-class="mid" style="height:300rpx;" :value="health_rate_index"  @change="set_rate">
						<picker-view-column>
							<view class="item" v-for="i in health_rate_list" :key="i">{{i}}</view></picker-view-column></picker-view></block>
					
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:30rpx;padding:16rpx 30rpx;" @tap="cancel">取消</view>
				    <view style="color:#4685F8;margin-right:30rpx;padding:16rpx 30rpx;" @tap="confirm">确定发送</view>
				</view>
			</view>
		</view>
		<!-- 语言和时区蒙层 -->
		<view class="my-mask" v-if="isshowlanguage">
			<view class="wrap">
				<view class="my-cell-top">设置语言和时区</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
				<picker-view indicator-class="mid" style="height:300rpx;" :value="time_language_index"  @change="set_time_language">
					<picker-view-column>
						<view class="item1" v-for="i in time_language_list" :key="i">{{i}}</view></picker-view-column></picker-view>
				
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:30rpx;padding:16rpx 30rpx;" @tap="cancellan">取消</view>
				    <view style="color:#4685F8;margin-right:30rpx;padding:16rpx 30rpx;" @tap="confirmlan">确定发送</view>
				</view>
			</view>
		</view>
		<!-- 恢复出厂设置蒙层 -->
		<view class="my-mask" v-if="isshowreback">
			<view class="wrap1">
			    <view class="my-cell-top">恢复出厂设置</view>
			    <view class="my-cell-center" style="margin:0 30rpx;background-color: #efefef;border-radius:16rpx;">此操作将清空设备中保存的电话号码等信息，是否继续？</view>
			    <view class="my-cell">
			    	<view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="isshowreback=false">取消</view>
			    	<view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirmreback">确定</view>
			    </view>
			</view>
		</view>
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	
	export default {
		data() {
			var send_rate_list = ["15 s","30 s","45 s","1 min","2 min","5 min","10 min","30 min"];
			var health_rate_list = ["5 min","15 min","30 min","45 min","1 h","2 h","3 h","4 h"];
			var time_language_list = ["简体中文","English","Português","español","Deutsch","Türkçe","Vietnamese language","Русский","Français"];
			var v_send_rate = "15",v_health_rate = "300",v_time_language = "1";
			var order = this.$store.state.order;
			if(order){
				if(order.send_rate){v_send_rate = order.send_rate;};
				if(order.health_rate){v_health_rate = order.health_rate;};
				if(order.time_language){v_time_language = order.time_language;};
			};
			var i1,i2,i3;
			switch(v_send_rate){case "15":i1 = 0;break;case "30":i1 = 1;break;case "45":i1 = 2;break;case "60":i1 = 3;break;case "120":i1 = 4;break;case "300":i1 = 5;break;case "600":i1 = 6;break;case "1800":i1 = 7;break;default:i1 = 0;break;};
			switch(v_health_rate){case "300":i2=0;break;case "900":i2=1;break;case "1800":i2=2;break;case "2700":i2=3;break;case "3600":i2=4;break;case "7200":i2=5;break;case "10800":i2=6;break;case "14400":i2=7;break;default:i2=0;break;};
			switch(v_time_language){case "0":i3=1;break;case "1":i3=0;break;case "2":i3=8;break;case "3":i3=2;break;case "4":i3=3;break;case "5":i3=4;break;case "7":i3=5;break;case "8":i3=6;break;case "9":i3=7;break;default:i3=1;break;};
			var send_rate_index = [i1],health_rate_index = [i2],time_language_index = [i3],finalindex = [i1,i2,i3];
			return {
				tempindex:'',
				send_rate_index,health_rate_index,time_language_index,finalindex,send_rate_list,health_rate_list,time_language_list,
				i:0,
				title:"数据上传频率",
				isshowlanguage:false,
				isshowtimes:false,
				isshowreback:false,
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		computed:{
			//显示的数据上传频率
			send_rate(){return this.send_rate_list[this.finalindex[0]]},
			//显示的健康数据上传频率
			health_rate(){return this.health_rate_list[this.finalindex[1]]},
			//显示的语言和时区
			time_language(){return this.time_language_list[this.finalindex[2]]},
		},
		onLoad() {
			console.log("load");
		},
		methods:{
			//打开单列选择  设置当前操作索引i  实际值的[i]的索引==>初始设置值索引,中间值索引
			openshowtimes(i){ 
				this.i = i;
				if(i==0){
					this.title = "数据上传频率";
					this.send_rate_index = [this.finalindex[0]];
					this.tempindex = this.finalindex[0];
				}else{
					this.title = "健康数据上传频率";
					this.health_rate_index = [this.finalindex[1]];
					this.tempindex = this.finalindex[1];
				};
				this.isshowtimes = true;
			},
			language(){
				this.time_language_index = [this.finalindex[2]];
				this.tempindex = this.finalindex[2];
				this.isshowlanguage = true;
			},
			set_time_language(e){
				this.tempindex = e.detail.value[0];
			},
			cancellan(){this.isshowlanguage = false;},
			confirmlan(){
				this.isshowlanguage = false;
				this.$set(this.finalindex,2,this.tempindex);
				var v ,t = this.finalindex[2];
				switch(t){case 0:v="1";break;case 1:v="0";break;case 2:v="2";break;case 3:v="4";break;case 4:v="5";break;case 5:v="7";break;case 6:v="8";break;case 7:v="9";break;case 8:v="2";break;default:v="1";break;};
				this.req("time_language",v,"语言和时区设置");
			},
			set_rate(e){this.tempindex = e.detail.value[0];},
			//确定:关闭单列选择,将中间值索引==>实际值的[i]的索引
			confirm(){
			    this.isshowtimes = false;
			    this.$set(this.finalindex,this.i,this.tempindex);
				if(this.i==0){
					var v ,t = this.finalindex[0];
					switch(t){case 0:v="15";break;case 1:v="30";break;case 2:v="45";break;case 3:v="60";break;case 4:v="120";break;case 5:v="300";break;case 6:v="600";break;case 7:v="1800";break;default:v="15";break;};
					this.req("send_rate",v,"数据上传频率设置");
				}else if(this.i==1){
					var v ,t = this.finalindex[1];
					switch(t){case 0:v="300";break;case 1:v="900";break;case 2:v="1800";break;case 3:v="2700";break;case 4:v="3600";break;case 5:v="7200";break;case 6:v="10800";break;case 7:v="14400";break;default:v="300";break;};
					this.req("health_rate",v,"健康数据上传频率设置");
				}
			},
			//取消:关闭弹窗
			cancel(){this.isshowtimes = false;},
			version(){this.req("verson_detail","0","设备版本信息");},
			confirmreback(){this.isshowreback=false;this.req("factory_set","0","恢复出厂设置");},
			//下发指令的通用函数
			req(order,value,title){
				var that = this;
				var data = {"param_data":{"device_id":that.infor.device_id,"set_command":order,"set_value":value}};
				uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					console.log(res);
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
		},
		
	}
</script>

<style>
.my-frame-little{
	margin-bottom:10rpx;
}
.icon-right1{
	position:absolute;
	top:28rpx;
	right:16rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;
}
.icon-right2{
	position:absolute;
	top:23rpx;
	right:16rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;
}
.wrap,.wrap1{
	width:680rpx;
	height:554rpx;
	margin:300rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px; 
}
.wrap1{
	height:406rpx;
}
.item{
	align-items:center;
	justify-content: center;
	font-size:56rpx;
	height:56px;
	background-color:#E9ECEF;
}
.item1{
	align-items:center;
	justify-content: center;
	font-size:40rpx;
	height:56px;
	background-color:#E9ECEF;
}
.mid{height:100rpx;}
</style>
