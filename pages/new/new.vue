<template>
	<view class="page">
		<view class="my-header">下拉刷新，长按删除<view style="border-bottom:2rpx solid #aaaaaa;width:35%"></view></view>  
		<view v-if="isshow" class="no-content"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
		<view class="my-frame" v-for="(item,index) in list" :key="index" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0" @longpress="goDelete(item)">
		 	<!-- <view style="padding:12rpx;justify-content:center;align-items:center;font-weight:700;">{{item.name}}</view> -->
			<view style="padding:16rpx;justify-content:center;align-items:center;color:#ee3300;font-weight:700;">
				<view style="margin-right:12rpx;"><image style="width:26px;height:26px;" src="/static/alarm.png"></image></view>
				<view style="font-size:34rpx;">{{kind(item.kind)}}</view>
			</view>
			<view class="my-line"></view>
			<view class="big">名称 : {{item.name}}</view>
			<view class="bottom">报警时间 : {{item.s_time}}</view>
			<view class="bottom" style="margin-bottom:14rpx;">报警地点 : {{item.location}}</view>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		data() {
			return {
				list:[],
				alert:"",
				isshowreback:false,
				isshow:false,
			}
		},
		computed: {
			token(){return this.$store.state.logindata.token},
			url(){return this.$store.state.url},
		},
		watch:{
			alert(val,v) {
				// if(v.toString()==val.toString()){uni.stopPullDownRefresh();return};
				// console.log("报警更新");
				var that = this,len = val.length;
				uni.setTabBarBadge({index:1,text:len+""});  
				this.isshow=false; 
				this.list = [];
				if(val.length==0){uni.stopPullDownRefresh();that.isshow=true;return};
				for (let i = 0; i < len; i++) {
					// console.log(val[i]);
					that.list.push({kind:val[i].kind,name:val[i].car_name,alarm_content:val[i].alarm_content,s_time:val[i].s_time,location:"获取中...",id:val[i].id});
					new Promise((resolve, reject) => {
						let point = new plus.maps.Point(val[i].lng, val[i].lat);
						plus.maps.Map.reverseGeocode(point, {},
							function(e) {resolve(e.address)},
							function(e) {resolve("获取当前地址失败!");});
					}).then(e => {
						if(!e){e="获取当前地址失败!"};
						that.list[i].location = e
						// that.list.push({kind:val[i].kind,name:val[i].car_name,alarm_content:val[i].alarm_content,s_time:val[i].s_time,location:e,id:val[i].id});
						
						uni.stopPullDownRefresh();
					}).catch(e => {
						console.log(JSON.stringify(e));
						uni.stopPullDownRefresh();
					})
				}
			},
		},
		onLoad() {
			console.log("load");
			this.reflesh();
		// 	this.list= [{name:"测试001",kind:"stop_alarm",alarm_content:"",s_time:"2019-11-18 01:47:13",location:"陕西省西安市雁塔区电子城街道电子社区软件公寓C座荣禾·城市理想"}]
		// 
		},
		methods:{
			kind(v){
				if(v=="stop_alarm"){return "停留报警"
				}else if(v=="sos_alarm"){return "SOS报警"
				}else if(v=="quake_alarm"){return "启动报警"
				}else if(v=="power_off"){return "停车报警"
				}else if(v=="low_power"){return "低电量报警"
				}else if(v=="l_pres_low"||v=="h_pres_low"||v=="h_pres_heig"||v=="l_pres_heig"){return "血压报警"
				}else if(v=="heart_low"||v=="heart_high"){return "心率报警"
				}else if(v=="out_ele_low"){return "围栏报警"
				}else if(v=="speed_alarm"){return "超速报警"}
				else{return v}
			},
			goDelete(item){
				var that =this;
				uni.showActionSheet({
					itemList: ['删除', '取消'],
					success: function(res) {
						if(res.tapIndex == 0) {
							uni.request({
								url:that.url+"/alarm_abnormal/",method:"POST",
								header:{"authorization":that.token},    
								data:{id:item.id,handle:"已处理",remark:"0"},sslVerify:false,
								success: (res) => {
									if (res.data.code == 1000) {
										console.log("报警消息处理成功");
										that.reflesh();
							        }else{console.log(res);var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});uni.stopPullDownRefresh();};
							    },
							    fail:(res) =>{console.log(res);uni.showToast({icon: 'none',title:"请检查网络",duration:2000});uni.stopPullDownRefresh();}
							});
						} 
					},
					fail: function(res) {console.log(res.errMsg);}
				});
			},
			reflesh() {
				var that = this;
				//报警请求
				uni.request({
					url:this.url+"/real_time/",method:"GET",
					header:{"authorization":this.token,"map":"gd"},sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000) {
							console.log("报警请求成功");
							res.data.data.sort(function(a,b){
							    if(a.id<b.id){return -1;}
							    if(a.id>b.id){return 1;}
							    return 0;
							})
							that.alert = res.data.data;
				        }else{console.log(res);var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});uni.stopPullDownRefresh();that.isshow=true;};
				    },
				    fail:(res) =>{console.log(res);uni.showToast({icon: 'none',title:"请检查网络",duration:2000});uni.stopPullDownRefresh();that.isshow=true;}
				});
			}
		},
		onHide(){console.log("hide");},
		onPullDownRefresh() {
			this.reflesh();
			uni.stopPullDownRefresh();
		},
	}
</script>
<style>
.my-frame{margin:16rpx auto 24rpx;}
.my-line{border-bottom:0.6px solid #C8C7CC;margin:0 30rpx;}

.big{
	font-size:32rpx;
	font-weight:700;
	padding:12rpx 30rpx 4rpx;
	line-height:1.4;
}
.bottom{
	font-size:30rpx;
	padding:4rpx 30rpx;
	line-height:1.4;
}
.no-content{
	margin-top:26rpx;
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
