<template>
	<view class="page">
		<view class="content">
			<scroll-view class="msg-list" style="bottom:200rpx;" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true" :scroll-into-view="scrollToView" upper-threshold="50" @scrolltoupper="loadHistory"> 
			<!-- <view class="msg-list" style="display:block;position:relative;"> -->
			<view class="my-header" style="margin-top:1px;">{{thetoptip}}<view style="border-bottom:2rpx solid #aaaaaa;width:20%"></view></view>
			
			<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
				<view class="time1">{{row.time}}</view>
				<view class="other">
					<view class="left">
						<image src="/static/face2.png"></image></view>
					<view class="right">
						<view class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
							<view class="icon other-voice"></view>
							<view class="length">{{row.length}}</view>
						</view>
					</view>
				</view>
			</view><view style="height:20rpx;width:100%;"></view>
			</scroll-view>
		</view>	
		<!-- <view class="page-section page-section-gap" style="text-align: center;">
		                <audio style="text-align: left" src="https://106.13.26.102:8089/root/123.mp3"  controls></audio>
		</view> -->
	    <!-- 录音面板 -->
		<view class="bottom">
	    	<view class="time">
	    	    <picker  @change="changeTime" :value="index" range-key="time" :range="array">
	    	        <view class="showtime"   hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">{{array[index].time}}</view></picker>
	    		<view class="text">录音时长</view> </view>
	    	<view class="btn"  hover-class="my-hover10" :hover-stay-time="100" :hover-start-time="50" @tap="startRecord">
	    	    <image style="height:160rpx;width:160rpx" src="/static/v-start.png"></image><view class="text">开始录音</view>
			</view>
			<view class="btn"  hover-class="my-hover10" :hover-stay-time="100" :hover-start-time="50" @tap="endRecord">
			    <image style="height:160rpx;width:160rpx" src="/static/v-end.png"></image><view class="text">结束录音</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" ><view class="icon luyin2" ></view></view>
			<view class="tis" >录音中...</view>
		</view>
	</view> 
</template>
<script>
	import vuex from 'vuex'
	var r = null;var id = 0;
	function getDate(type){var that=this;var date = new Date();if(type=="lastweek"){date.setTime(date.getTime()-24*60*60*7000);}if(type=="tenseconds"){date.setTime(date.getTime()-12000);}let year = date.getFullYear();let month = date.getMonth() + 1;let day = date.getDate();let hours =  date.getHours();let minutes =  date.getMinutes();let seconds = date.getSeconds();month = month > 9 ? month : '0' + month;day = day > 9 ? day : '0' + day;hours = hours > 9 ? hours : '0' + hours;minutes = minutes > 9 ? minutes : '0' + minutes;seconds = seconds > 9 ? seconds : '0' + seconds;return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`};
	var tenseconds=null,now=null,timernow=null,timerhistory=null,istoday=null;
	export default {
		data() {
			return {
				isHistoryLoading:false,//是否是第一次加载
				thetoptip:"下拉加载历史录音",//顶部提示
				sametime:'',//时间参考值
				msgList:[],//消息列表:文字列表，图片列表，声音列表
				// msgHistoryList:[],
				scrollToView:"",
				scrollTop:9999999,
				timer:null,
				recordTis:"00:00",//录音文字
				recording:false, //是否录音中
				playMsgid:null, //正在播放的id
				array:[{time:'30 s',value:30},{time:'60 s',value:60},{time:'90 s',value:90},{time:'120 s',value:120},{time:'150 s',value:150},{time:'180 s',value:180},{time:'连续',value:"continuous"}],
				index:0,
				p:"",//播放器对象
				infor:this.$store.state.information,
				url:this.$store.state.url,
				token:this.$store.state.logindata.token,
			};
		},
		computed:{lastweek(){return getDate("lastweek")},today(){return getDate()},},
		onLoad(option) {
			var that =this;
			this.p = plus.audio.createPlayer({src:""});
			id = 0;istoday = getDate().slice(0,10);
			timernow = setInterval(function(){that.reqNow()},10000);
			this.p.addEventListener("canplay",function(){
				console.log("音频已就绪");
				console.log(that.p.getDuration()+"秒");
				console.log(that.p.getStyles());
				that.p.play(function(){console.log('播放成功');that.playMsgid=null;},
				            function(){console.log('播放失败');});
			});
			
		},
		onUnload(){
			this.endRecord();
			clearInterval(timernow);clearInterval(that.timer);
			console.log("unload");
			console.log("但是颠三倒四");
		},
		methods:{
			loadHistory(){
				if(this.isHistoryLoading){console.log("已加载");return;}
				this.thetoptip = "加载中...";
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.reqHistory();
			},
			// 播放语音
			playVoice(v){
				console.log("点击了");
				this.p.setStyles({src:v.url});
				this.playMsgid=v.id;
				console.log(v.url.slice(-8,-3));
				// layer.pause();
				// player.isPaused();
				
			},
			startRecord(){
				if(this.recording){uni.showToast({title:"录音中",icon:"none",duration:1000});return}
				var that = this;var time = this.array[this.index].value;
				var data = {"what":"recording","param_data":{"device_id":that.infor.device_id,"set_command":"start_sound_record","set_value":time}};
				uni.request({url:this.url +"/device_set_car/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => { 
					if (res.data.code == 1000) {
						uni.showToast({title:"设备开始录音",icon:"none"});
						that.recording = true;
						if(that.timer){
							// that.recordTis ="00:00";
						clearInterval(that.timer);};
						var minutes =0,seconds =0,minute = 0,second = 0,all = 0;
						that.timer = setInterval(function(){
							seconds++;all++;
							// if(all==time){that.endRecord();return}
							if(all==time){that.recording = false;uni.showToast({title:"录音已结束",icon:"none",duration:3000});}
							// if(seconds==60){seconds=seconds-60;minutes=minutes+1};
							// second = seconds > 9 ? seconds : '0' + seconds;
							// minute = "0"+minutes;
							// that.recordTis = minute+":"+second;
						},1100)
					}else{
					console.log(res);var error = "错误码:"+res.statusCode;
					if(res.data.code){error=res.data.error};
					uni.showToast({title:error,icon:"none",duration:2000});}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}) },
				});	
			},
			endRecord(){
				this.recording = false;
				// this.recordTis ="00:00";
				clearInterval(this.timer);
				uni.showToast({title:"录音已结束",icon:"none",duration:2000});
				var that = this;
				var data = {"what":"recording","param_data":{"device_id":that.infor.device_id,"set_command":"close_sound_record","set_value":"0"}};
				uni.request({
					url:this.url +"/device_set_car/",
					method:"POST",header:{"authorization": this.token,},data:data,
					success: (res) => {
						if (res.data.code == 1000) {
							console.log(res);
							uni.showToast({title:"录音已结束",icon:"none",duration:2000});
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});}
						},
						fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}) },
				});
			},
			//查询历史聊天记录
			reqHistory(){
				var that = this;var url = this.url;
				var device_id = this.infor.device_id;
				var data = {"device_id":device_id,"s_time":this.lastweek,"e_time":this.today};
				uni.request({url:this.url +"/select_avp/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						console.log("有历史消息了");
						var list = res.data.data.all_data,len = list.length;
						var msg = {},iv =999,time0="",time1="";
						for(let i=len-1;i>-1;i--){
							iv++;
							time1 = list[i].add_time.slice(0,16);
							if(time0==time1){time1=""}else{time0 = time1;if(time1.slice(0,10)==istoday){if(time1.slice(11,13)>11){time1="下午 "+time1.slice(11,)}else{time1="上午 "+time1.slice(11,)}}};
							// if(list[i].kind=="voice"){// 	msg = {url:"",length:"30s"};// 	that.dataURL2Audio(list[i].content,function(entry){// 		// that.$set(that.msgList[i].msg.content,"url",toURL);// 		that.msgHistoryList[i].content.url = entry.toURL();// 	})// }
							that.msgList.unshift({id:iv,time:time1,type:"voice",url:url+list[i].picture_path,length:"30秒"});
						};
						uni.vibrateLong();
						var timeout = setTimeout(function(){that.thetoptip = "历史录音已加载";clearTimeout(timeout);},500)
					}else{
						that.thetoptip = "暂无历史录音";that.isHistoryLoading = false;var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});console.log(error+"时间"+data.s_time+"--时间"+data.e_time);}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:3000});that.thetoptip = "下拉加载历史录音";that.isHistoryLoading = false;}});
			},
			//每十秒查询一次最新聊天纪律
			reqNow(){
				var that = this;var url = this.url;
				var device_id = this.infor.device_id;
				tenseconds = getDate("tenseconds");now = getDate();
				var data = {"device_id":device_id,"s_time":tenseconds,"e_time":now};
				uni.request({url:this.url +"/select_avp/",method:"POST",header:{"authorization": this.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000) {
						console.log("有新消息了");uni.showToast({title:"有新消息了",icon:"none",duration:2000})
						var list = res.data.data.all_data;
						var len = list.length;var content = {};
						// 获取新消息
						for(let i=0;i<len;i++){
							var nowDate = new Date();
							var hours = nowDate.getHours(),minutes = nowDate.getMinutes(),morning="上午 ";
							if(hours>11){morning="下午 "};
							hours = hours > 9 ? hours : '0' + hours;minutes = minutes > 9 ? minutes : '0' + minutes;
							var newtime = morning+hours+":"+minutes;
							if(that.sametime == newtime){newtime = ''}else{that.sametime = newtime}
							id++;
							that.msgList.push({id:id,time:newtime,type:"voice",url:url+list[i].picture_path,length:"30秒"});
							
							that.$nextTick(function() {
							                that.scrollToView = 'msg'+id;
											console.log(that.scrollToView);
							});
							uni.vibrateLong();
						};
					}else{var error = "错误码:"+res.statusCode;if(res.data.code){error="暂无聊天消息"};console.log(error+" 时间:"+data.s_time+" -- 时间:"+data.e_time);}
				},
				fail:(res)=>{console.log(res);},});
			},
			
			//清理聊天信息
			goclear(){plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){fs.root.removeRecursively(function(entry){console.log("清理成功");},function(e){console.log("清理失败");});})},
			changeTime: function(e) {this.index = e.target.value},
		}
	}
</script>
<style lang="scss">
	@import "@/common/style.scss"; 
.content{
	// display:block;
	
}
.bottom{
	// width:100%;
	height:200rpx;
	background-color:#fff;
	position:fixed;
	bottom:0;
	display:flex;
	justify-content:space-around;
	// align-items:center;
	box-shadow:2px 2px 6px #999;
}
.btn{
	height:180rpx;
	justify-content:center;
	position:relative;
}
.text{
	position:absolute;
	bottom:0;
	font-size:30rpx;
}
.time{
	width:160rpx;
	height:170rpx;
	padding-bottom:10rpx;
	justify-content:center;
	align-items:center;
	position:relative;
}
.showtime{
	width:120rpx;
	height:70rpx;
	font-size:36rpx;
	box-shadow:1px 1px 4px #aaa;
	border-radius:10rpx;
	justify-content:center;
	align-items:center;
}
.my-hover10{
	opacity:0.6;
}
.record{
	width: 40vw;
	height: 40vw;
	position: fixed;
	top: 36%;
	left: 30%;
	border-radius: 20upx;
	.tis{
		font-size: 32rpx;
		letter-spacing:0.3px;
	}
}

</style>