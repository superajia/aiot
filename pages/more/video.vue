<template>
	<view class="page">
	</view>
</template>
<script>
	import vuex from 'vuex'
	
	var video = null,pusher=null,currentWebview=null,hh=null,view=null,view2=null,view3=null,scale=1,white=1,sound=1,timer=null,time="00:00";
	export default {
	    data() {
	        return {
				dev:this.$store.state.information.device_id,
				innerAudioContext:"",
				// url:this.$store.state.url,
	        }
	    },
		computed:{
			url(){
				return "rtmp://。。。。。/0"+this.dev+"01"
			}
		},
		onLoad() {
			console.log("load");
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.loop = true;
			this.innerAudioContext.src = 'static/music.mp3';
			this.innerAudioContext.onCanplay(() => {this.innerAudioContext.play();});
			// var isimmer = plus.navigator.isImmersedStatusbar();//是否是沉浸式
			// if(isimmer){hh = parseInt(plus.navigator.getStatusbarHeight()+1)}else{hh=0};//状态栏高度
			var that = this;
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			currentWebview = page.$getAppWebview();
			//对方拉流层
			video = new plus.video.VideoPlayer('videoplayer',{
				src:that.url,
				autoplay:true,//自动播放
				"show-center-play-btn":false,//隐藏中间播放按钮
				"show-fullscreen-btn":false,//隐藏全屏按钮
			    "controls":false,//隐藏默认控件
				"enable-progress-gesture":false,//禁止手控
			});
			// video.hide(); 
			//己方推流层
			pusher = new plus.video.LivePusher('livepusher', {
				        url:that.url,
						top:'6%',
						left:'70%',
						width:'26%',
						height:'20%',
						position: 'static',
						mode:'HD',
			});
			view = new plus.nativeObj.View('test',
			    {bottom: '4%',left: '5%',height: '80px',width: '90%'},
				[{tag:'rect',id:'rect0',rectStyles:{color:'rgba(255,255,255,0.7)',radius:'10px'}},
				{tag:'img',id:'test1', src:'static/v-turn.png',position: {top:'25px',left:'6%',width:'30px',height:'30px'}},
				{tag:'img',id:'test2', src:'static/v-voice.png',position: {top:'25px',left:'24%',width:'30px',height:'30px'}},
				{tag:'img',id:'test3', src:'static/v-close.png',position: {top:'16px',left:'43%',width:'48px',height:'48px'}},
				{tag:'img',id:'test4', src:'static/v-m.png',position: {top:'25px',left:'68%',width:'30px',height:'30px'}},
				{tag:'img',id:'test5', src:'static/v-photo.png',position: {top:'25px',left:'86%',width:'30px',height:'30px'}},
			]);
			view2 = new plus.nativeObj.View('test2',{bottom:'15%',left:'30%',height:'40px',width:'40%'},[{tag:'font',id:'test',text:'等待对方接听...',textStyles:{size:'20px',align: 'center',color:'#fff'},position:{top: '0px',left: '0px',width: '100%',height: '40px'}}]);
			view3 = new plus.nativeObj.View('test3',{top:'6%',left:'6%',height:'34px',width:'34px'},[{tag:'img',id:'test3', src:'static/v-switch2.png'}]);
			view3.addEventListener("click", function(e) {if(scale==1){pusher.setStyles({height:"100%"});scale=2}else{pusher.setStyles({top:'6%',left:'70%',width:'26%',height:'20%',});scale=1};});
			view.addEventListener("click", function(e) {var x = e.clientX;var y = e.clientY;var that = this;
			    if(x>135&&x<195){uni.navigateBack();
					}else if(y>10&&y<70){
						if(x>10&&x<50){pusher.switchCamera();
						}else if(x>70&&x<110){
							if(sound==1){video.setStyles({muted:true});sound=2}
							else{video.setStyles({muted:false});sound=1};
						}else if(x>230&&x<270){
							if(white==1){pusher.setStyles({beauty:1,whiteness:3});white=2}
							else{pusher.setStyles({beauty:0,whiteness:0});white=1};
						}else if(x>290&&x<340){
							pusher.snapshot(function(e){console.log(e);},function(e){console.log(e);});
						}
					}
			    });
			//监听开始播放
			video.addEventListener('play', function(e){
				console.log("拉流成功");
				that.start();
				pusher.start(function(){
					console.log("推流成功");
				},function(e){console.log(e);uni.showToast({icon:"none",duration:2000,content:"错误码"+e.code+":"+e.message})});    });
			// 监听播放出错事件
			video.addEventListener('error', function(e){
				console.log("播放失败");    }); 
			currentWebview.append(video);
			currentWebview.append(pusher);
			currentWebview.append(view);
			currentWebview.append(view2);
			currentWebview.append(view3);
			
			// 监听状态变化事件
			pusher.addEventListener('statechange', function(e){
				console.log('statechange: '+JSON.stringify(e));
			}, false);
			// 监听推流信息事件 
			pusher.addEventListener('netstatus', function(e){
				console.log('netstatus: '+JSON.stringify(e));    });
			// 监听错误事件
			pusher.addEventListener('error', function(e){
				console.log('netstatus: '+JSON.stringify(e));    });
			
		},
	    methods: {
			start(){
				var hours = 0,minutes =0,seconds =0,hour ="",minute = 0,second = 0;
				timer = setInterval(function(){
					seconds++;
					if(seconds==60){seconds=seconds-60;minutes=minutes+1};
					if(minutes==60){minutes=minutes-60;hour="0"+(hours+1)+":"};
					minute = minutes > 9 ? minutes : '0' + minutes;
					second = seconds > 9 ? seconds : '0' + seconds;
					time = hour+minute+":"+second;
					view2.reset();
					view2.drawText(time,{top: '0px',left: '0px',width: '100%',height: '40px'},{size: '22px',align: 'center',color:'#fff'});	
				},1000);
			},
			send(){
				// var that =this;
				// var data = {"param_data":{"device_id":that.infor.device_id,"set_command":"find_dev","set_value":"0"}};
				// uni.request({url:this.url +"/device_set_person/",method:"POST",header:{"authorization": this.token},data:data,
				// success: (res) => {
				// 	// console.log(res);
				// 	if (res.data.code == 1000) {
				// 		uni.showModal({title:"找设备",content:res.data.data.msg,showCancel:false});
				// 	}else{
				// 		var error = "错误码:"+res.statusCode;
				// 		if(res.data.code){error=res.data.error};
				// 		uni.showModal({title:"找设备",content:"指令发送失败,"+error,showCancel:false});}
				// },
				// fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000});}
				// });
			}
	    },
		onUnload(){
			console.log("unload");
			clearInterval(timer);
			this.innerAudioContext.destroy();
		}
	}
</script>

<style>
.page{
	background-color:#000000;
}
.my-cell{
	background: #e2f5fc;
	margin:30rpx;
	border-radius: 16upx;
	font-size: 38rpx;
	letter-spacing:0.5px;
}
.icon{
	width:260rpx;
	height:260rpx;
	margin:260rpx auto 10rpx;
	border-radius:50%; 
	border:0.6px solid #aaa;
	justify-content:center;
	align-items:center;
	background-color:#ffffff;
}
.my-hover{background-color:rgba(100,100,100,0.2)}
</style>
