<template>
	<view class="page-white">
		<view class="my-cell"><text class="my-text-center">{{carname}}</text></view>
		<view class="my-cell1">
			<text class="font-weight">开始时间 : </text>
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="changeDate">
				<view class="pick-row">{{date}}</view></picker>
			<picker mode="time" :value="time" start="09:01" end="21:01" @change="changeTime">
				<view class="pick-row">{{time}}</view></picker>
		</view>
		<view class="my-cell1">
			<text class="font-weight">结束时间 : </text>
			<picker mode="date" :value="date1" :start="startDate1" :end="endDate1" @change="changeDate1">
				<view class="pick-row">{{date1}}</view></picker>
			<picker mode="time" :value="time1" start="09:01" end="21:01" @change="changeTime1">
				<view class="pick-row">{{time1}}</view></picker>
		</view>
		<view >
			<radio-group class="my-cell3" name="radio">
				<label @tap="picktoday"><radio value="radio1" :checked="1==pickindex"/>今天</label>
				<label @tap="pickyesterday"><radio value="radio2" :checked="2==pickindex"/>昨天</label>
				<label @tap="picklastday"><radio value="radio2" :checked="3==pickindex"/>最近三天</label>
			</radio-group>
		</view>
		<button style="margin-top:50rpx;" hover-class="hover"  @tap="confirm">确定</button>
		
	</view>
</template>
<script>
	import vuex from 'vuex'
	export default {
		onLoad(){
		},
		data() {
			const currentDate = this.getDate();
			const currentTime = this.getTime();
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 2010; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				url:this.$store.state.url,
				showPicker: false,
				// startTimeArray: [],
				// startTime: [],
				date0: currentDate,
				date: currentDate,
				date1: currentDate,
				time0:'23:59',
				time: '00:00',
				time1:currentTime,
				pickindex:1,
				// years,
				// year,
				// months,
				// month,
				// days,
				// day,
				value: [9999, month - 1, day - 1],
				visible: true,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			startDate1() {
				return this.getDate('start');
			},
			endDate1() {
				return this.getDate('end');
			},
			device_id(){return this.$store.state.information.device_id},
			carname() {return this.$store.state.information.name},
			kind() {return this.$store.state.information.kind},
			lat() {return this.$store.state.information.lat},
			lng() {return this.$store.state.information.lng},
			token(){
				return this.$store.state.logindata.token
			}
		},
		methods: {
			confirm() {
				console.log("点击确定了");
				var that = this;
				var start = this.date + " " + this.time;
				var end = this.date1 + " " + this.time1;
				var hard_id = {"select_car":that.device_id,"data":{"s_time":start,"e_time":end}};
				uni.request({
					url: this.url+"/car_trajectory/",
					method: "POST",
					data:hard_id,sslVerify:false,
					header: {"authorization":this.token,"key":"vehicle_history_track","map":"gd"},
					success: (res) => {
						if(res.data.code == 1000){
							// console.log(res);
							var tempdata =res.data.data.moving_order;
							if(tempdata.length<3){uni.showToast({title:'暂无轨迹',icon:'none',duration:2000});return}
							var enddata = JSON.stringify(tempdata);
							plus.storage.setItem("guiji",enddata);
							plus.storage.setItem("carname",that.carname);
							plus.storage.setItem("kind",that.kind);
							uni.navigateTo({url:'trail'})
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});
						};
					},
					fail:(res) =>{
						console.log(res);
						uni.showToast({icon:'none',title:"请检查网络",duration:2000});
					},
				});
			},
			picktoday:function(e){
				this.date  = this.date0;
				this.date1 = this.getDate();
				this.time = '00:00';
				this.time1 = this.getTime();
				
			},
			pickyesterday:function(e){
				this.date  = this.getDate("yesterday");
				this.date1 = this.getDate("yesterday");
				this.time = '00:00';
				this.time1 = '23:59';
			},
			picklastday:function(e){
				this.date  = this.getDate("lastday");
				this.date1 = this.getDate();
				this.time = '00:00';
				this.time1 = this.getTime();
			},
			changeDate: function(e) {
				this.date = e.target.value;
			},
			changeDate1: function(e) {
				this.date1 = e.target.value;
			},
			changeTime: function(e) {
				this.time = e.target.value;
			},
			changeTime1: function(e) {
				this.time1 = e.target.value;
			},
			getDate(type) {
				var that=this;
				var date = new Date();
				if(type=="yesterday"){
					date.setTime(date.getTime()-24*60*60*1000);
				}else if(type=="lastday"){
					date.setTime(date.getTime()-24*60*60*2000);
				}
				let year = date.getFullYear();let month = date.getMonth() + 1;let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getTime() {
				var that=this;
				var date = new Date();
				let hours =  date.getHours();let minuter =  date.getMinutes();
				hours = hours > 9 ? hours : '0' + hours;;
				minuter = minuter > 9 ? minuter : '0' + minuter;
				return `${hours}:${minuter}`;
			}
		}
	}
</script>

<style>
.my-cell1{
	padding:20rpx 30rpx;
	border-bottom:0.5px solid #CCCCCC;
	border-top:0.5px solid #CCCCCC;
	margin-top:10rpx;
}
.my-cell2{
	padding:30rpx 0;
}
.my-cell3{
	margin-top:20rpx;
	padding:20rpx;
	display: flex;
	justify-content:space-around;
}
.pick-row{
	margin-left:50rpx;
}
.font-weight{font-weight: 700;}
</style>
