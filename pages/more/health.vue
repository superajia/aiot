<template>
	<view class="page">
	    <!-- <view class="my-header">设备报警参数设置<view style="border-bottom:2rpx solid #aaaaaa;width:30%"></view></view> -->
	    <view class="my-frame-little" style="margin:24rpx auto 10rpx;">
	    	<view class="my-cell-big">
	    		<view>当前设备号码</view><view style="color:#808080;">{{infor.device_id}}</view></view>
	    </view>
		
	    <view class="my-before">设置报警参数,当超过设定值时设备会报警</view>
	    <view class="my-frame-little" style="padding:10rpx 0;">
	    	<view class="my-cell" @tap="openprompt(1)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
	    		<view>心率报警设置</view><view style="color:#808080;justify-content:flex-end;padding-right:24rpx;">{{heart[0]}}~{{heart[1]}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
	    	<view class="my-cell" @tap="openprompt(2)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
	    		<view>血压报警设置</view><view style="color:#808080;justify-content:flex-end;padding-right:24rpx;">{{l_blood[0]}}~{{l_blood[1]}}/{{h_blood[0]}}~{{h_blood[1]}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
			<view class="my-cell" @tap="openprompt(3)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<view>停留报警设置</view><view style="color:#808080;justify-content:flex-end;padding-right:24rpx;">{{stoptime}}</view><span class="iconfont icon-right">&#xe61b;</span></view>
	    </view>
		
		<!-- 心率报警设置的蒙层 -->
		<view class="my-mask" v-if="isshowheart">
			<view class="wrap1">
				<view class="my-cell-top">心率报警设置</view>
				<view class="my-cell">
					<range-slider width="490" height="66" :block-size="50" :bar-height="8"
					  min="0" max="200" :values="v_heart"
					  :liveMode="true" @rangechange="sliderheart"></range-slider>
					<view style="width:130rpx;justify-content:center;">{{v_heart[0]}}~{{v_heart[1]}}</view>
				</view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="cancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm1">确定</view>
				</view>
			</view>
		</view> 
		<!-- 血压报警设置的蒙层 -->
		<view class="my-mask" v-if="isshowblood">
			<view class="wrap2">
				<view class="my-cell-top">血压报警设置</view>
				<view class="my-cell" style="padding:16rpx 30rpx;">
					<view style="width:100rpx;font-size:32rpx;">舒张压</view>
				    <range-slider width="390" height="66" :block-size="50" :bar-height="8" min="0" max="200" :values="v_l_blood"
				      :liveMode="true" @rangechange="sliderl_blood"></range-slider>
				    <view style="width:130rpx;justify-content:center;">{{v_l_blood[0]}}~{{v_l_blood[1]}}</view></view>
				<view class="my-cell" style="padding:16rpx 30rpx;">
					<view style="width:100rpx;font-size:32rpx;">收缩压</view>
					<range-slider width="390" height="66" :block-size="50" :bar-height="8" min="0" max="200" :values="v_h_blood"
					  :liveMode="true" @rangechange="sliderh_blood"></range-slider>
					<view style="width:130rpx;justify-content:center;">{{v_h_blood[0]}}~{{v_h_blood[1]}}</view></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="cancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm2">确定</view>
				</view>
			</view>
		</view>
		<!-- 停留报警设置的蒙层 -->
		<view class="my-mask" v-if="isshowstoptime">
			<view class="wrap3">
				<view class="my-cell-top">停留报警设置</view>
				<view style="border-top:0.7px solid #aaaaaa;"></view>
				<picker-view indicator-class="mid" style="height:300rpx;" :value="stoptime_index"  @change="changestop">
					<picker-view-column>
					<view class="item" v-for="i in stoptime_list" :key="i">{{i}}</view></picker-view-column></picker-view>
				<view style="border-bottom:0.7px solid #aaaaaa;"></view>
				<view class="my-cell">
				    <view style="color:#666666;margin-left:70rpx;padding:16rpx 30rpx;" @tap="cancel">取消</view>
				    <view style="color:#4685F8;margin-right:70rpx;padding:16rpx 30rpx;" @tap="confirm3">确定</view>
				</view>
			</view>
		</view>
	    <button style="margin-top:160rpx;" hover-class="hover"  @tap="send">提交</button>
	</view>
</template>
<script>
	import vuex from 'vuex'
	import RangeSlider from 'components/range-slider/range-slider.vue'
	export default { 
		components:{RangeSlider},
		data() {
			return { 
				// 实际值
				stoptime_list:["5 min","15 min","30 min","45 min","1 h","2 h","3 h","4 h"],
				v_heart:[0,200],
				v_h_blood:[0,200],
				v_l_blood:[0,200],
				stoptime_index:'',
				tempindex:'',
				// 显示值
				heart:[0,200],
				h_blood:[0,200],
				l_blood:[0,200],
				finalindex:0,
				
				isshowblood:false,
				isshowheart:false,
				isshowstoptime:false,
				
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			}
		},
		computed:{stoptime(){return this.stoptime_list[this.finalindex]},},
		onLoad() {
			console.log("load");
			this.get();
		},
		methods:{
			//打开弹窗 根据i不同,打开不同的对话框,并设置相应的值
			openprompt(i){
				if(i==1){this.v_heart = this.heart;this.isshowheart = true;
				}else if(i==2){this.v_h_blood =this.h_blood;this.v_l_blood =this.l_blood;this.isshowblood = true;
				}else{this.stoptime_index=[this.finalindex];this.isshowstoptime = true;};
			},
			sliderheart(e){this.v_heart = [Number(e.minValue),Number(e.maxValue)];},
			sliderh_blood(e){this.v_h_blood = [Number(e.minValue),Number(e.maxValue)];},
			sliderl_blood(e){this.v_l_blood = [Number(e.minValue),Number(e.maxValue)];},
			changestop(e){this.tempindex = e.detail.value[0];},
			//取消:关闭弹窗
			cancel(){this.isshowheart = false;this.isshowblood = false;this.isshowstoptime = false;},
			//确定:关闭弹窗,将实际值==>显示值(作为发送值依据)
			confirm1(e){this.isshowheart = false;this.heart = this.v_heart;},
			confirm2(e){this.isshowblood = false;this.h_blood = this.v_h_blood;this.l_blood = this.v_l_blood;},
			confirm3(e){this.isshowstoptime = false;this.finalindex = this.tempindex;},
			send(){
				var stop_rate,list;
				list = ["300","900","1800","2700","3600","7200","10800","14400"];
				stop_rate = list[this.finalindex];
				var title ="报警参数设置";
				var data ={
					"what":"setting",
					"param_data":{
						"device_id":this.infor.device_id,
						"heart_set":{"heart_low":this.heart[0],"heart_high":this.heart[1]},
						"stop_rate":stop_rate,
						"blood_set":{"l_pres_low":this.l_blood[0],"l_pres_heig":this.l_blood[1],"h_pres_low":this.h_blood[0],"h_pres_heig":this.h_blood[1]}}
				};
				uni.request({url:this.url +"/alarm_set_person/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000){
						uni.showModal({title:title,content:res.data.data.msg,showCancel:false});
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showModal({title:title,content:"指令发送失败,"+error,showCancel:false});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			get(){
				var that = this;
				uni.request({url:this.url +"/alarm_set_person/?dev="+this.infor.device_id,method:"GET",header:{"authorization": this.token},sslVerify:false,
				success: (res) => {
					// console.log(res);
					if (res.data.code == 1000) {
						var data = res.data.data[0];
						that.heart=[data.heart_set.heart_low,data.heart_set.heart_high];
						that.h_blood=[data.blood_set.h_pres_low,data.blood_set.h_pres_heig,];
						that.l_blood=[data.blood_set.l_pres_low,data.blood_set.l_pres_heig,];
						switch(data.stop_rate){case "300":that.finalindex=0;break;case "900":that.finalindex=1;break;case "1800":that.finalindex=2;break;case "2700":that.finalindex=3;break;case "3600":that.finalindex=4;break;case "7200":that.finalindex=5;break;case "10800":that.finalindex=6;break;case "14400":that.finalindex=7;break;default:that.finalindex=0;break;};
					}else{
						var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			}
		},
		
	}
</script>
<style>
.icon-right{
	position:absolute;
	top:22rpx;
	right:16rpx;
	color:#808080;
	line-height:1.5;
	font-size:38rpx;
}
.wrap1,.wrap2,.wrap3{
	width:680rpx;
	height:356rpx;
	margin:300rpx 35rpx;
	display:block;
	background-color:#fff;
	border-radius:10px;  
	overflow: hidden;
}
.wrap2{height:450rpx;}
.wrap3{height:554rpx;}
.item{
	align-items:center;
	justify-content: center;
	font-size:56rpx;
	height:56px;
	background-color:#E9ECEF;
}
.mid{height:100rpx;}
</style>
