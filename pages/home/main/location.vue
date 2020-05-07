<template>
	<view class="page-white">
		<map id="map" style="width:750rpx;height:82vh;" :latitude="latitude" :longitude="longitude" :markers="marker" :polyline="polyline" scale="16" ></map>
		<view class="bottom">
			<view class="my-cell1" style="height:4vh;"><text class="f0">{{temp.name}}</text></view>
			<!-- <view  style="border-bottom:0.7px solid #C8C7CC;margin:0 10px;"></view> -->
			<view class="my-cell1" style="height:3vh;"><text class="f1" :class="{green:temp.status=='在线'}">{{temp.status}}</text><text class="f1">{{temp.speed}} km/h</text><text class="f1">定位类型: {{temp.track_type}}</text></view>
		    <view class="my-cell1" style="height:3vh;"><text class="f1">通讯时长: {{temp.serv_receive}}</text><text class="f1">定位时间: {{temp.dev_upload}}</text></view>
			<view class="my-cell1" style="height:7vh;"><text class="f2">位置: {{address}}</text></view>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				marker:[{
					id:1,
					latitude:this.$store.state.information.lat,
					longitude:this.$store.state.information.lng,
					iconPath:'/static/dian.png',
				}],
				polyline: [{points:[],color:"#00CC33",width:9,arrowLine:true,dottedLine:true},],
				timer:"",
				map:null,
				temp:this.$store.state.information,
				location:this.$store.state.location,
				kind:this.$store.state.information.kind,
			}
		},
		computed: {
			url(){return this.$store.state.url},
			token(){return this.$store.state.logindata.token},
			index(){return this.$store.state.information.index},
			
			longitude(){return this.temp.lng},
			latitude(){return this.temp.lat},
			address(){return this.location},
		},
		onLoad() {
			console.log("load");
			this.polyline[0].points.push({latitude:this.latitude,longitude:this.longitude});
			this.map = uni.createMapContext("map");
            this.requestlocation();
			this.timer = setInterval(this.requestlocation, 15000);
		},
		methods:{
			requestlocation(){
				var that = this;
				uni.request({
					url:this.url+"/all_on_line/",
					method: "GET",
					header: {"authorization":that.token,"key":"all_on_line","map": "gd"},sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000){
							console.log("位置请求成功");
							that.temp = res.data.data.all_device[that.index];
							that.polyline[0].points.push({latitude:that.temp.lat,longitude:that.temp.lng});
							new Promise((resolve, reject) => {
								var point = new plus.maps.Point(that.temp.lng,that.temp.lat);
								plus.maps.Map.reverseGeocode(point, {},
								    function(e){resolve(e.address);}, 
									function(e){resolve("获取当前地址失败!")});
							}).then(address => {
								// console.log(address)
								this.location = address;
							}).catch(e => {console.log(e)});
							that.map.translateMarker({
								markerId:1,  
								destination:{latitude:that.latitude,longitude:that.longitude},
								autoRotate:true,  
								rotate:0,
								duration:5000, 
								animationEnd:function(){console.log("到达终点")},
								fail:function(res){console.log(res)},
							}); 
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});
						};
					},
					fail:(res) =>{
						console.log(res);
						uni.showToast({icon: 'none',title:"请检查网络",duration:2000});
					},
				});
			}
		},
		onUnload(){
			console.log("unload");
			clearInterval(this.timer)
		},
		onShow(){
			console.log("show")
		},
		onHide(){
			console.log("hide")
		},
	}
</script>
<style>
.bottom{
	position:fixed;bottom:0;
	height:18vh;width:722rpx;padding:0 14rpx;
	flex-direction:column;
}
.my-cell1{
	/* padding:1px 14px 2px 10px; */
	justify-content:space-between;
	align-items:center;
}
	.f0{
		font-size:14px;
		/* line-height:1.3; */
		font-weight:700;
	}
	.f1{
		font-size:12px;
		color:#808080;
	}
	.f2{
		font-size:14px;
		line-height:1.4;
		height:40px;
	}
	.green{
		color:#1AAD19
	}
</style>
