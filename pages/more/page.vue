<template>
	<view class="page">
		<block v-if="infor.kind=='person_gps'">
			<view class="my-frame">
				<view class="my-cell0"><text>名称</text><text class="font-grey">{{infor.name}}</text></view><view class="my-line0"></view>
				<view class="my-cell0"><text>性别</text><text class="font-grey">男</text></view><view class="my-line0"></view>
				<view class="my-cell0"><text>心率</text><text class="font-grey">{{infor.heart_rate}}(次/min)</text></view><view class="my-line0"></view>
				<view class="picture-frame"><image class="picture" style="" src="../../static/i-header0.png"></image></view>
			    <view class="my-cell"><text>血压</text><text class="font-grey">{{blood_pres(infor.blood_pres)}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>步数</text><text class="font-grey">{{infor.step_count}}步</text></view><view class="my-line"></view>
				<view class="my-cell"><text>停留</text><text class="font-grey">{{infor.stop_time}}</text></view>
			</view>
			<view class="my-frame"> 
				<view class="my-cell"><text>设备id</text><text class="font-grey">{{infor.device_id}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>电量</text><text class="font-grey">{{infor.battery}}%</text></view><view class="my-line"></view>
				<view class="my-cell"><text>定位类型</text><text class="font-grey">{{infor.track_type}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>设备状态</text><text class="font-grey">{{infor.status}}</text></view><view class="my-line"></view>
				<!-- <view class="my-cell"><text>定位时间</text><text class="font-grey">{{infor.dev_upload}}</text></view><view class="my-line"></view> -->
				<view class="my-cell"><text>通讯时间</text><text class="font-grey">{{infor.serv_receive}}</text></view><view class="my-line"></view>
				<view class="my-cell"><view class="min-length">位置</view><text class="font-grey" style="font-size:32rpx;">{{location}}</text></view>
			</view>
		</block>
		
		<!-- 车辆模板 -->
		<block v-else>
			<view class="my-frame">
				<view class="my-cell"><text>名称</text><text class="font-grey">{{infor.name}}</text></view><view class="my-line"></view>
				<!-- {{Number(infor.mileage.oil*100).toFixed(0)}}% -->
				<view class="my-cell"><text>油量</text><text class="font-grey">{{infor.oil_box}}%</text></view><view class="my-line"></view>
				<view class="my-cell"><text>水量</text><text class="font-grey">{{infor.water_box}}%</text></view><view class="my-line"></view>
				<view class="my-cell"><text>停留时长</text><text class="font-grey">{{infor.stop_time}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>总里程</text><text class="font-grey">{{infor.mileage.meliage}}km</text></view>
				
			</view>
			<view class="my-frame"> 
				<view class="my-cell"><text>设备id</text><text class="font-grey">{{infor.device_id}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>电量</text><text class="font-grey">{{infor.battery}}%</text></view><view class="my-line"></view>
				<view class="my-cell"><text>定位类型</text><text class="font-grey">{{infor.track_type}}</text></view><view class="my-line"></view>
				<view class="my-cell"><text>设备状态</text><text class="font-grey">{{infor.status}}</text></view><view class="my-line"></view>
				<!-- <view class="my-cell"><text>定位时间</text><text class="font-grey">{{infor.dev_upload}}</text></view><view class="my-line"></view> -->
				<view class="my-cell"><text>通讯时间</text><text class="font-grey">{{infor.serv_receive}}</text></view><view class="my-line"></view>
				<view class="my-cell"><view class="min-length">位置</view><text class="font-grey" style="font-size:32rpx;">{{location}}</text></view>
			</view>
		</block>
			
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				infor:this.$store.state.information,
				location:this.$store.state.location,
			}
		},
		onLoad() {
			console.log("load");
		},
		methods:{
			blood_pres(v){
				if(!v){return "0"
				}else{return v.h_pres+"(高)/"+v.l_pres+"(低)"}
			},
		}
		
	}
</script>

<style>
.min-length{
	width:165rpx;
}
.picture-frame{
	width:190rpx;height:252rpx;
	position:absolute;top:32rpx;right:26rpx;
	/* background-color:rgba(0,204,255,0.5); */
	background-color:#E9ECEF;
	justify-content:center;align-items:center;
}
.picture{
	width:90px;height:90px
}
.my-line{margin:0 30rpx;}
.my-line0{margin:0 240rpx 0 30rpx;border-bottom:0.5px solid #C8C7CC;}
.my-frame{
	border-radius:12rpx;position:relative;
}
.my-cell0{
	padding:20rpx 50rpx 20rpx 30rpx;margin-right:200rpx;
	justify-content:space-between;
	align-items:center;position:relative;
}
</style>
