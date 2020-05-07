<template>
	<view class="page">
		<view class="my-frame-list">
			<!-- 状态栏 -->
			<view class="li-cell2">
				<view v-for="(list,index) in leftPart" :key="index" class="li-pick" @tap="leftChange(index)" :class="{active:index==i}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">{{list.name}}</view></view>
		    <!-- 搜索栏 -->
			<view class="" style="margin:0 30rpx 24rpx;position:relative;">
				<span class="iconfont icon-left">&#xe60a;</span>
				<input class="my-input" confirm-type="search" @confirm="confirm" placeholder-style="font-size:36rpx;" placeholder="请输入设备号或名称" v-model="listinput"/></view>
		</view>
		<view v-if="isios" class="blankios"></view>
		<view v-else class="blank"></view>
		
		<view class="no-content2" v-if="showList.length==0"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
		<view style="width:100%;display:block;background-color:#fff;" v-for="(item,index) in showList" :key="index">
			<view class="li-list" @tap="selectId(item.device_id)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
				<span class="iconfont icon-left1" :class="{green:item.status=='在线'}">&#xe767;</span>
				<block v-if="item.kind=='person_gps'">
					<span class="iconfont icon-left2">&#xe643;</span></block>
				<block v-else>
					<span class="iconfont icon-left3">&#xe627;</span></block>
				<view class="li-textl1">{{item.name}}</view>
				<view class="li-textl1  li-textx">IMEI : {{item.device_id}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	import vuex from 'vuex';
	export default {
		data() {
			var isios = false;
			if(this.$store.state.isandroid=="false"){isios=true;}
			return {
				leftPart: [{name: "全部"}, {name: "在线"}, {name: "离线"}, {name: "休眠"}],
                listinput: '',//搜索框内容
                i:0,//第几个页面
                showList:[],//展示列表
                allList:[],onlineList:[],offlineList:[],otherList:[],
				token:this.$store.state.logindata.token,
				url:this.$store.state.url,
				isios,
			}
		},
		onLoad() {console.log("load");this.requestArrs();},
		onPullDownRefresh() {this.requestArrs();},
		onNavigationBarButtonTap() {uni.navigateTo({url: 'tree'})},
		watch: {
			i(i) {
				if(i==0){
					this.showList = this.allList;
				}else if(i==1){
					this.showList = this.onlineList;
				}else if(i==2){
					this.showList = this.offlineList;
				}else{
					this.showList = this.otherList;
				}
			}
		},
		methods:{
			leftChange(i) {this.i = i;},
			requestArrs() {
				this.i = "";
				uni.request({
					url: this.url + "/all_on_line/",
					method: "GET",sslVerify:false,
					header: {"authorization": this.token,"map": "gd","key": "all_on_line"},
					success:(res) => {
						if(res.data.code == 1000){
								console.log("在线状态请求成功");
								var arrs = res.data.data.on_line_or_off_line;
								this.allList = res.data.data.all_device;
								this.onlineList = arrs.on_line;
								this.offlineList = arrs.off_line;
								this.otherList = arrs.sleep;
								uni.stopPullDownRefresh();
								this.i=0;
								// console.log(this.arrs);
								// this.$store.commit('setonline', res.data.data.on_line_or_off_line);
					}else{
						this.i=0;uni.stopPullDownRefresh();
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail:(res)=>{
						this.i=0;uni.stopPullDownRefresh();console.log(res);
						uni.showToast({title:'请检查网络',icon:"none",duration:2000});
					},
				});
			},
			// confirm() {var that = this,len = this.arrs.length;this.newarrs = [];for (var i = 0; i < len; i++) {if (that.arrs[i].device_id.search(that.listinput) != -1 ||that.arrs[i].name.search(that.listinput) != -1) {that.newarrs.push(that.arrs[i]);}}return newarrs;},
			confirm() {
				var that = this;this.i = 0;
				this.$nextTick(function(){
					var len = this.allList.length;
					that.showList = [];
					for (var i = 0; i < len; i++) {
						if (that.allList[i].device_id.search(that.listinput) != -1 || that.allList[i].name.search(that.listinput) !=-1) {
							that.showList.push(that.allList[i]);
						}
					}
					if(that.showList.length==0){uni.showToast({title:"没有查询到该设备",icon:"none",duration:2000});}
				});
			},
			selectId(item) {this.$store.commit('settm', item);uni.switchTab({url: '../home'});},
		}
	}
</script>

<style>
.page {display:block;width: 750rpx;}
.my-frame-list{
	z-index: 100;
	position: fixed;
	width:100%;
	display:block;
	background-color:#fff;
	box-shadow:1px 1px 6px #aaa;
}
.li-cell2{
	padding:20rpx 0 16rpx;
	justify-content:space-between;
	flex-flow: row wrap;	
}
.li-pick {
	flex: 1 0 30px;
	justify-content: center;
	align-items: center;
	margin:0 20rpx;
	color: #444;
	font-size: 38rpx;
}
.icon-left{
	position:absolute;
	top:22rpx;
	left:20rpx;
	color:#777;
	line-height:1.5;
	font-size:38rpx;
}
.icon-left1{
	position:absolute;
	top:20rpx;
	left:26rpx;
	color:#808080;
	/* line-height:1.5; */
	font-size:16rpx;
}
.icon-left2{
	position:absolute;
	top:16rpx;
	left:56rpx;
	color:#808080;
	font-size:56rpx;
}
.icon-left3{
	position:absolute;
	top:44rpx;
	left:50rpx;
	color:#808080;
	font-size:28rpx;
}
.green{color:#09BB07;}
.active{color:#007AFF}
.blank,.blankios{
	display: block;
	height:212rpx;
	width: 100%;
}
.blankios{height:218rpx;}
.li-list {
	flex-direction: column;
	border-bottom: 3rpx solid #D9D9D9;
	padding: 16rpx 0;
	position:relative;
}
.imag{
	position: absolute;
	top: 12px;
	left: 14px;
	width: 60px;
	height:60px;
}
.li-textl1 {
	padding-left:160rpx;
	letter-spacing:0.5px;
	font-size: 34rpx;
	line-height:1.4;
}
.li-textx {
	font-size: 26rpx;
	line-height:1.4;
	color:#808080;
}
.my-input{
	background:#e2f5fc;
	width:650rpx;
	border-radius: 12rpx;
	padding: 20rpx 66rpx;
	font-size:36rpx;
	letter-spacing:0.5px;
}
.no-content2{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	margin-top:40rpx;
	width:750rpx; 
	position:absolute;
	z-index:-10;
}
/* .my-hover{background-color:rgba(100,100,100,0.2)} */
</style>
