<template>
	<view class="page">
		<block v-if="index=='0'">
			<view class="m-cell">
				<view class="m-pick" @tap="leftChange(0)" :class="{active:i==0}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">申请用车</view>
				<view class="m-pick" @tap="leftChange(1)" :class="{active:i==1}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">申请中</view>
				<view class="m-pick" @tap="leftChange(2)" :class="{active:i==2}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">申请结果</view>
				<view class="m-pick" @tap="leftChange(3)" :class="{active:i==3}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">申请记录</view>
			</view>
			<swiper class="m-swiper" :current="i" @change="change" circular="true">
				<swiper-item style="position:relative;">
				    <view class="my-frame" style="margin-top:30rpx;padding:10rpx 0;">
				    	<view class="row">
							<view style="width:150rpx;">出发地</view>
				    		<input class="my-input" type="text" placeholder-class="placeholder" placeholder="请输入出发地" name="name1" v-model="vgo"/></view>
				    	<view class="row">
							<view style="width:150rpx;">目的地</view>
				    		<input class="my-input" type="text" placeholder-class="placeholder" placeholder="请输入目的地" name="name2" v-model="vto"/></view>
				    	<view class="row">
							<view style="width:150rpx;">车辆用途</view>
				    		<input class="my-input" type="text" placeholder-class="placeholder" placeholder="请输入车辆用途" name="name3" v-model="vuse"/></view>
				    	<view class="row">
				    		<view style="width:150rpx;">使用人员</view>
				    		<view class="my-input" @tap="showmask=true" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{showPerson}}</view>
							<!-- 设置多选的蒙层 -->
							<view style="position:absolute;z-index:99;top:0;right:0;left:0;bottom:0;" v-if="showmask" @tap="showmask=false">
								<view class="multi-list" @tap.stop="">
									<view style="display:block;height:286rpx;overflow:auto;border:1px solid #aaa;">
										<block  v-for="(item,i) in perList" :key="i">
											<view class="multi-item" :class="{active2:item.active}" @tap="select(item,i)"><span style="margin-right:20rpx;">{{item.name}}</span><span>{{item.phone}}</span></view></block></view>
									<view class="my-cell" style="padding:16rpx 30rpx;">
									    <view style="color:#333;padding:16rpx 40rpx;" @tap="clear">清空</view>
									    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="showmask=false;">确定</view></view>
								</view>
							</view>
						</view>
				    	<view class="row">
				    		<view style="width:150rpx;">开始时间</view>
							<view class="my-input">
								<picker mode="date" :value="date" @change="changeDate">
				    			    <view  style="font-size:36rpx;margin-right:40rpx;">{{date}}</view></picker>
				    		    <picker mode="time" :value="time" @change="changeTime">
				    			    <view  style="font-size:36rpx;">{{time}}</view></picker>
							</view>
						</view>
				    	<view class="row">
				    		<view style="width:150rpx;">结束时间</view>
				    		<view class="my-input">
				    			<picker mode="date" :value="date1" @change="changeDate1">
				    			    <view style="font-size:36rpx;margin-right:40rpx;">{{date1}}</view></picker>
				    		    <picker mode="time" :value="time1" @change="changeTime1">
				    			    <view style="font-size:36rpx;">{{time1}}</view></picker>
				    		</view>
						</view>
				    	
				    </view>
					<view v-if="isios" style="margin-top:70rpx">
						<button  hover-class="hover" formType="submit" @tap="send">提交申请</button>
					</view>
					<view v-else style="position:absolute;bottom:100rpx;left:25rpx;">
						<button  hover-class="hover" formType="submit" @tap="send">提交申请</button></view>
					
				</swiper-item>
				
				<!-- 申请中。。。 -->
				<swiper-item style="overflow:auto;">  
					<view v-if="isshowchecking" class="no-content"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view> 
						<view class="my-frame" v-for="(item,i) in checking" :key="i">
							<view class="item-top">
								<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-apply.png"></image></view>
								<view>申请单</view><view class="item-top-right" style="color:#ff8800;">申请中</view>
							</view> 
							<view class="my-line"></view>
							<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
							<view class="item-more">用途 : {{item.car_use}}</view>
							<view class="item-more">人员 : {{item.person_name}}</view>
							<view class="item-more">电话 : {{item.phone}}</view>
							<view class="item-bottom">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						</view>
				</swiper-item>
				
				<!-- 申请结果 -->	
				<swiper-item style="overflow:auto;"> 
					<view v-if="isshowchecked" class="no-content"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view> 
						<view class="my-frame" v-for="(item,i) in checked" :key="i">
							<block v-if="item.apply_status=='申请驳回'">
								<view class="item-top">
									<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-apply.png"></image></view>
									<view>申请单</view><view class="item-top-right" style="color:#ee3300">{{item.apply_status}}</view>
								</view> 
								<view class="my-line"></view>
								<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
							    <view class="item-more">驳回原因 : {{item.remark}}</view>
							</block>
							<block v-else>
								<view class="item-top">
									<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-apply.png"></image></view>
									<view>申请单</view><view class="item-top-right" :class="{active4:item.apply_status=='已提车'}">{{item.apply_status}}</view>
								</view> 
								<view class="my-line"></view>
								<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
								<view class="item-left">验证码 : {{item.othermsg1}}</view>
								<view class="item-more">司机 : {{item.driver}}</view>
								<view class="item-more">车牌号 : {{item.apply_car}}</view>
								<view style="border-bottom:1px solid #C8C7CC;margin:6rpx 30rpx;"></view>
							</block>
							<view class="item-more">用途 : {{item.car_use}}</view>
							<view class="item-more">人员 : {{item.person_name}}</view>
							<view class="item-more">电话 : {{item.phone}}</view>
							<view class="item-bottom">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						</view>
				</swiper-item>
					
				<!-- 申请记录 -->
				<swiper-item style="overflow:auto;"> 
					<view class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view> 
					<view class="my-frame-little" style="margin:24rpx auto;" v-for="(item,i) in history" :key="i">
						<view class="item-top-history"  @tap="changeshowStatus(item.showStatus,i)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-apply.png"></image></view>
							<view style="width:300rpx;">申请记录 {{i+1}}</view>
							<view v-if="item.apply_status=='out'" style="width:240rpx;color:#6699ff">{{status(item.apply_status)}}</view>
							<view v-if="item.apply_status=='in'" style="width:240rpx;color:#000">{{status(item.apply_status)}}</view>
							<view v-if="item.apply_status=='0'" style="width:240rpx;color:#ff8800">{{status(item.apply_status)}}</view>
							<view v-if="item.apply_status=='no'" style="width:240rpx;color:#ee3300">{{status(item.apply_status)}}</view>
							<view v-if="item.apply_status=='ok'" style="width:240rpx;color:#00b26a">{{status(item.apply_status)}}</view>
							<span class="iconfont grey" :class="{active3:item.showStatus}">&#xe602;</span>
						</view> 
						<view style="border-bottom:0.7px solid #C8C7CC;margin:0 30rpx 6rpx;"></view>
						<block v-if="item.showStatus">
							<view class="item-left">行程 : {{item.departure}} => {{item.destination}}</view>
							<view class="item-more">用途 : {{item.car_use}}</view>
							<view class="item-more">人员 : {{item.person_name}}</view>
							<view class="item-more">电话 : {{item.phone}}</view>
							<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						</block>
						<view class="item-more" style="font-weight:700;font-size:30rpx;justify-content:flex-end;margin-bottom:8rpx;">提交于 {{item.apply_time}}</view>
					</view>
				</swiper-item>	
			</swiper>
		</block>
		
		
		
		
		
		
		
		
		
		
		
		
		
		<block v-if="index=='1'">
			<view class="m-cell">
				<view class="m-pick" @tap="leftChange(0)" :class="{active:i==0}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">待派车</view>
				<view class="m-pick" @tap="leftChange(1)" :class="{active:i==1}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">已通过</view>
				<view class="m-pick" @tap="leftChange(2)" :class="{active:i==2}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">已驳回</view>
				<view class="m-pick" @tap="leftChange(3)" :class="{active:i==3}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">派车记录</view>
			</view>
			<swiper class="m-swiper" :current="i" @change="change" circular="true">
				
				<swiper-item style="overflow:auto;">
					<view class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame" v-for="(item,i) in checking" :key="i">
						<view class="item-top"> 
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-dispatch1.png"></image></view>
							<view>派车单</view><view class="item-top-right" style="color:#ff8800">待派车</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between"> 
							<button class="mini-btn" style="background-color:#108EE9" @tap="submitUp1(item)">提交上级</button>
							<button class="mini-btn" style="background-color:#00B26A" @tap="dispatchFirst(item)">派 车</button>
							<button class="mini-btn" type="warn" @tap="refuse1(item)">驳 回</button></view>
					</view>
				</swiper-item>
				<!-- 已通过。。。 -->
				<swiper-item style="overflow:auto;">
					<view class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame" v-for="(item,i) in okList" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-dispatch1.png"></image></view>
							<view>派车单</view><view class="item-top-right" style="color:#00b26a">已通过</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">司机 : {{item.driver}}</view>
						<view class="item-more">车牌号 : {{item.apply_car}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between">
							<button class="mini-btn" style="background-color:#ff9933" @tap="exchange(item,'pass')">换 车</button>
							<button class="mini-btn" style="background-color:#00B26A" @tap="click_carry">提 车</button></view> 
					</view>
					<view class="my-frame" v-for="(item,i) in outList" :key="i"> 
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-dispatch1.png"></image></view>
							<view>派车单</view><view class="item-top-right" style="color:#6699ff">已提车</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">司机 : {{item.driver}}</view>
						<view class="item-more">车牌号 : {{item.apply_car}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between">
							<button class="mini-btn" style="background-color:#ff9933" @tap="exchange(item,'driving')">换 车</button>
							<button class="mini-btn" style="background-color:#00B26A" @tap="click_return">还 车</button></view> 
					</view>
				</swiper-item>
				
				<!-- 已驳回 -->	
				<swiper-item style="overflow:auto;">
					<view  class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame" v-for="(item,i) in noList" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-dispatch1.png"></image></view>
							<view>派车单</view><view class="item-top-right" style="color:#ee3300">已驳回</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">驳回原因 : {{item.remark}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view style="padding:10rpx 20rpx 22rpx;">
							<view class="mini-btn" style="width:450rpx"></view>
							<button class="mini-btn" type="warn" @tap="cancel(item,'reject')">取消驳回</button></view> 
					</view>
				</swiper-item>
				
				<!-- 派车记录 -->
				<swiper-item style="overflow:auto;"> 
					<view class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view> 
					<view class="my-frame-little" style="margin:24rpx auto;" v-for="(item,i) in history2" :key="i">
						<view class="item-top-history"  @tap="changeshowStatus2(item.showStatus,i)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-dispatch1.png"></image></view>
							<view style="width:300rpx;">派车记录 {{i+1}}</view>
							<view v-if="item.apply_status=='0'" style="width:240rpx;color:#ff8800">{{status2(item.apply_status)}}</view>
							<view v-if="item.apply_status=='no'" style="width:240rpx;color:#ee3300">{{status2(item.apply_status)}}</view>
							<view v-if="item.apply_status=='ok'" style="width:240rpx;color:#00b26a">{{status2(item.apply_status)}}</view>
							<span class="iconfont grey" :class="{active3:item.showStatus}">&#xe602;</span>
						</view> 
						<view style="border-bottom:0.7px solid #C8C7CC;margin:0 30rpx 6rpx;"></view>
						<block v-if="item.showStatus">
							<view class="item-more">申请部门 : {{item.department_name}}</view>
							<view class="item-more">调度人 : {{item.verify_name}}</view>
							<view class="item-more">审核人 : {{item.verify_name_up}}</view>
							<view class="item-more">派用车辆 : {{item.car_name}}</view>
						</block>
						<view class="item-more" style="font-weight:700;font-size:30rpx;justify-content:flex-end;margin-bottom:8rpx;">派用时间 {{item.apply_time}}</view>
					</view>
				</swiper-item>	
			</swiper>
			<!-- 设置提车验证码的蒙层 -->
			<view class="maskmask" v-if="showmask_carry" @tap="showmask_carry=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">提车</view>
					<input class="my-input2" type="number" placeholder-class="placeholder" placeholder="请输入提车验证码"  v-model="carry"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_carry=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_carry('/car_operation_dispatcher/')">确定</view></view>
				</view>
			</view>
			<!-- 设置取消驳回的蒙层 -->
			<view class="maskmask" v-if="showmask_cancel" @tap="showmask_cancel=false">
				<view class="multi-list3" style="height:362rpx" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">取消驳回</view>
					<view class="my-cell-center" style="padding:12rpx 30rpx;letter-spacing:0.5px;background-color: #efefef;border-radius:16rpx;">取消驳回后该派车单将进入待派车列表，是否继续？</view>
					<view class="my-cell" style="padding:16rpx 40rpx;">
						<view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_cancel=false">取消</view>
						<view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_cancel('/car_operation_dispatcher/')">确定</view></view>
			</view></view>	
			<!-- 设置派车的蒙层 -->
			<view class="maskmask" v-if="showmask" @tap="showmask=false">
				<view class="multi-list2" @tap.stop="">
					<view class="my-cell-top" style="padding:20rpx 30rpx 10rpx;">开始派车</view>
					<view class="my-cell" style="padding:0 104rpx 0 128rpx;">
					    <view>车牌号</view><view>司机</view></view>
					<view style="justify-content:space-between;">
						<view class="col-1">
							<block  v-for="(item,i) in car_nameList" :key="i">
								<view class="multi-item2" :class="{active2:i==col1}" @tap="changecol1(i)"><span class="multi-item2-left">{{item.car_name}}</span><span>{{item.free_position}}座</span></view></block></view>
					    <view class="col-2">
					    	<block  v-for="(item,i) in driverList" :key="i">
					    		<view style="margin:16rpx 0;padding:10rpx" :class="{active2:i==col2}" @tap="changecol2(i)">{{item}}</view></block></view>
					</view>
					<view class="my-cell" style="padding:16rpx 60rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm('/car_operation_dispatcher/')">确定</view></view>
			</view></view>
			<!-- 设置驳回的蒙层 -->
			<view class="maskmask" v-if="showmask_refuse" @tap="showmask_refuse=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">驳回</view>
					<input class="my-input2" placeholder-class="placeholder" placeholder="请输入驳回原因"  v-model="refuse_cause"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_refuse=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_refuse('/car_operation_dispatcher/')">确定</view></view>
				</view>
			</view>
			<!-- 设置提交上级的蒙层 -->
			<view class="maskmask" v-if="showmask_submit" @tap="showmask_submit=false">
				<view class="multi-list3" style="height:362rpx" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">提交上级</view>
					<view class="my-cell-center" style="padding:12rpx 30rpx;letter-spacing:0.5px;background-color: #efefef;border-radius:16rpx;">提交上级后将不能操作此派车单，是否继续？</view>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_submit=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_submit">确定</view></view>
				</view>
			</view>
			<!-- 设置还车验证码的蒙层 -->
			<view class="maskmask" v-if="showmask_return" @tap="showmask_return=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">还车</view>
					<input class="my-input2"  type="number" placeholder-class="placeholder" placeholder="请输入还车验证码"  v-model="carry"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_return=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_return('/car_operation_dispatcher/')">确定</view></view>
				</view>
			</view>
			<!-- 设置换车的蒙层 -->
			<view class="maskmask" v-if="showmask_exc" @tap="showmask_exc=false">
				<view class="multi-list2" style="margin:19% auto;height:660rpx;" @tap.stop="">
					<view class="my-cell-top" style="padding:20rpx 30rpx 10rpx;">换车</view>
					<view class="my-cell" style="padding:0;justify-content:center;">
					    <view>车牌号</view></view>
					<view style="justify-content:center;">
						<view class="col-3">
							<block  v-for="(item,i) in car_nameList" :key="i">
								<view style="margin:16rpx 0;padding:10rpx 30rpx;" :class="{active2:i==col1}" @tap="changecol1(i)"><span style="width:450rpx;">{{item.car_name}}</span><span>{{item.free_position}}座</span></view></block></view>
					</view>
					<input class="my-input2" style="margin:20rpx auto 4rpx;" placeholder-class="placeholder" placeholder="请输入换车原因"  v-model="reason_exc"/>
					<view class="my-cell" style="padding:16rpx 60rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_exc=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_exc('/car_operation_dispatcher/')">确定</view></view>
				</view>
			</view>
		</block>
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		<!-- 审核员 -->
		<block v-if="index=='2'">
			<view class="m-cell">
				<view class="m-pick" @tap="leftChange(0)" :class="{active:i==0}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">待审核</view>
				<view class="m-pick" @tap="leftChange(1)" :class="{active:i==1}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">已通过</view>
				<view class="m-pick" @tap="leftChange(2)" :class="{active:i==2}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">已驳回</view>
				<view class="m-pick" @tap="leftChange(3)" :class="{active:i==3}" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">审核记录</view>
			</view>
			<swiper class="m-swiper" :current="i" @change="change" circular="true">
				<swiper-item style="overflow:auto;">
					<view style="padding:0 40rpx;margin-top:10rpx;font-size:36rpx;position:relative;">由我审核 : 
					<view  class="no-content3"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view></view>
					<view class="my-frame" style="margin-top:2rpx;" v-for="(item,i) in checking" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-check.png"></image></view>
							<view>审核单</view><view class="item-top-right" style="color:#ff8800">待派车</view></view> 
						<view class="my-line"></view>    
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between"> 
							<button class="mini-btn" style="background-color:#00B26A" @tap="dispatchFirst(item)">派 车</button>
							<button class="mini-btn" type="warn" @tap="refuse1(item)">驳 回</button></view>
					</view>
					<view style="padding:0 40rpx;margin-top:40rpx; font-size:36rpx;position:relative;">其他审核 : 
					<view class="no-content3"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view></view>
					<view class="my-frame" style="margin-top:2rpx;" v-for="(item,i) in checking2" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;" src="/static/i-check.png"></image></view>
							<view>审核单</view><view class="item-top-right" style="color:#ff8800">待派车</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-bottom">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
					</view>
				</swiper-item>
				
				<!-- 已通过。。。 -->
				<swiper-item style="overflow:auto;">
					<view class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame" v-for="(item,i) in okList" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-check.png"></image></view>
							<view>审核单</view><view class="item-top-right" style="color:#00b26a">已通过</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">司机 : {{item.driver}}</view>
						<view class="item-more">车牌号 : {{item.apply_car}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between">
							<button class="mini-btn" style="background-color:#ff9933" @tap="exchange(item,'pass')">换 车</button>
							<button class="mini-btn" style="background-color:#00B26A" @tap="click_carry">提 车</button></view> 
					</view>
					<view class="my-frame" v-for="(item,i) in outList" :key="i"> 
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-check.png"></image></view>
							<view>审核单</view><view class="item-top-right" style="color:#6699ff">已提车</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">司机 : {{item.driver}}</view>
						<view class="item-more">车牌号 : {{item.apply_car}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view class="item-between">
							<button class="mini-btn" style="background-color:#ff9933" @tap="exchange(item,'driving')">换 车</button>
							<button class="mini-btn" style="background-color:#00B26A" @tap="click_return">还 车</button></view> 
					</view>
				</swiper-item>
				
				<!-- 已驳回 -->	
				<swiper-item style="overflow:auto;">
					<view  class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame"  v-for="(item,i) in noList" :key="i">
						<view class="item-top">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-check.png"></image></view>
							<view>审核单</view><view class="item-top-right" style="color:#ee3300">已驳回</view></view> 
						<view class="my-line"></view>
						<view class="item-left">行程 : {{item.departure}}<span class="iconfont" style="font-size:10rpx;padding:20rpx 10rpx;">&#xe618;</span>{{item.destination}}</view>
						<view class="item-more">驳回原因 : {{item.remark}}</view>
						<view class="item-more">用途 : {{item.car_use}}</view>
						<view class="item-more">人员 : {{item.person_name}}</view>
						<view class="item-more">电话 : {{item.phone}}</view>
						<view class="item-more">时间 : {{item.s_car_time.slice(0,16)}} — {{item.e_car_time.slice(0,16)}}</view>
						<view style="padding:10rpx 20rpx 22rpx;">
							<view class="mini-btn" style="width:450rpx"></view>
							<button class="mini-btn" type="warn" @tap="cancel(item,'reject')">取消驳回</button></view> 
					</view>
				</swiper-item>
					
				<!-- 审核记录 -->
				<swiper-item style="overflow:auto;">
					<view  class="no-content2"><span class="iconfont" style="font-size:46rpx;padding-right:12rpx;">&#xe6f6;</span>暂无数据</view>
					<view class="my-frame-little" style="margin:24rpx auto;" v-for="(item,i) in history2" :key="i">
						<view class="item-top-history"  @tap="changeshowStatus2(item.showStatus,i)" hover-class="my-hover" :hover-stay-time="50" :hover-start-time="0">
							<view style="margin-right:16rpx;"><image style="width:28px;height:28px;border-radius:50%;overflow:hidden;" src="/static/i-check.png"></image></view>
							<view style="width:300rpx;">审核记录 {{i+1}}</view>
							<view v-if="item.apply_status=='0'" style="width:240rpx;color:#ff8800">{{status2(item.apply_status)}}</view>
							<view v-if="item.apply_status=='no'" style="width:240rpx;color:#ee3300">{{status2(item.apply_status)}}</view>
							<view v-if="item.apply_status=='ok'" style="width:240rpx;color:#00b26a">{{status2(item.apply_status)}}</view>
							<span class="iconfont grey" :class="{active3:item.showStatus}">&#xe602;</span>
						</view> 
						<view style="border-bottom:0.7px solid #C8C7CC;margin:0 30rpx 6rpx;"></view>
						<block v-if="item.showStatus">
							<view class="item-more">申请部门 : {{item.department_name}}</view>
							<view class="item-more">调度人 : {{item.verify_name}}</view>
							<view class="item-more">审核人 : {{item.verify_name_up}}</view>
							<view class="item-more">派用车辆 : {{item.car_name}}</view>
						</block>
						<view class="item-more" style="font-weight:700;font-size:30rpx;justify-content:flex-end;margin-bottom:8rpx;">派用时间 {{item.apply_time}}</view>
					</view>
				</swiper-item>	
			</swiper>
			<!-- 设置派车的蒙层 -->
			<view class="maskmask" v-if="showmask" @tap="showmask=false">
				<view class="multi-list2" @tap.stop="">
					<view class="my-cell-top" style="padding:20rpx 30rpx 10rpx;">开始派车</view>
					<view class="my-cell" style="padding:0 104rpx 0 128rpx;">
					    <view>车牌号</view><view>司机</view></view>
					<view style="justify-content:space-between;">
						<view class="col-1">
							<block  v-for="(item,i) in car_nameList" :key="i">
								<view class="multi-item2" :class="{active2:i==col1}" @tap="changecol1(i)"><span class="multi-item2-left">{{item.car_name}}</span><span>{{item.free_position}}座</span></view></block></view>
					    <view class="col-2">
					    	<block  v-for="(item,i) in driverList" :key="i">
					    		<view style="margin:16rpx 0;padding:10rpx" :class="{active2:i==col2}" @tap="changecol2(i)">{{item}}</view></block></view>
					</view>
					<view class="my-cell" style="padding:16rpx 60rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>
			<!-- 设置驳回的蒙层 -->
			<view class="maskmask" v-if="showmask_refuse" @tap="showmask_refuse=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">驳回</view>
					<input class="my-input2" placeholder-class="placeholder" placeholder="请输入驳回原因"  v-model="refuse_cause"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_refuse=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_refuse('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>
			<!-- 设置提车验证码的蒙层 -->
			<view class="maskmask" v-if="showmask_carry" @tap="showmask_carry=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">提车</view>
					<input class="my-input2"  type="number" placeholder-class="placeholder" placeholder="请输入提车验证码"  v-model="carry"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_carry=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_carry('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>
			<!-- 设置还车验证码的蒙层 -->
			<view class="maskmask" v-if="showmask_return" @tap="showmask_return=false">
				<view class="multi-list3" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">还车</view>
					<input class="my-input2"  type="number" placeholder-class="placeholder" placeholder="请输入还车验证码"  v-model="carry"/>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_return=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_return('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>
			<!-- 设置换车的蒙层 -->
			<view class="maskmask" v-if="showmask_exc" @tap="showmask_exc=false">
				<view class="multi-list2" style="margin:18% auto;height:660rpx;" @tap.stop="">
					<view class="my-cell-top" style="padding:20rpx 30rpx 10rpx;">换车</view>
					<view class="my-cell" style="padding:0;justify-content:center;">
					    <view>车牌号</view></view>
					<view style="justify-content:center;">
						<view class="col-3">
							<block  v-for="(item,i) in car_nameList" :key="i">
								<view style="margin:16rpx 0;padding:10rpx 30rpx;" :class="{active2:i==col1}" @tap="changecol1(i)"><span style="width:450rpx;">{{item.car_name}}</span><span>{{item.free_position}}座</span></view></block></view>
					</view>
					<input class="my-input2" style="margin:20rpx auto 4rpx;" placeholder-class="placeholder" placeholder="请输入换车原因"  v-model="reason_exc"/>
					<view class="my-cell" style="padding:16rpx 60rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_exc=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_exc('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>
			<!-- 设置取消驳回的蒙层 -->
			<view class="maskmask" v-if="showmask_cancel" @tap="showmask_cancel=false">
				<view class="multi-list3" style="height:362rpx" @tap.stop="">
					<view class="my-cell-top" style="padding:30rpx 30rpx 24rpx;">取消驳回</view>
					<view class="my-cell-center" style="padding:12rpx 30rpx;letter-spacing:0.5px;background-color: #efefef;border-radius:16rpx;">取消驳回后该审核单将进入待审核列表，是否继续？</view>
					<view class="my-cell" style="padding:16rpx 40rpx;">
					    <view style="color:#333;padding:16rpx 40rpx;" @tap="showmask_cancel=false">取消</view>
					    <view style="color:#4685F8;padding:16rpx 40rpx;" @tap="confirm_cancel('/car_operation_auditor/')">确定</view></view>
				</view>
			</view>	
		</block>
		  
	</view>
</template>
<script>
	import vuex from 'vuex';
	export default {
		data() {
			var kind = this.$store.state.logindata.permission;
			var index = "0";
			const currentDate = this.getDate();
			const currentTime = this.getTime();
			if(kind.application){
				
			}else if(kind.dispatcher){
				index = "1";
			}else if(kind.auditor){
				index = "2";
			}
			var isios = false;
			if(this.$store.state.isandroid=="false"){isios=true;}
			return {
				index,//角色索引0为申请者，1为派车员，2为审核员
                i:"",//切换栏索引
				showmask:false,//通用蒙层 申请，派车
				showmask_refuse:false,//驳回蒙层
				refuse_cause:"",//默认驳回理由
				showmask_carry:false,//提车验证码蒙层
				showmask_return:false,//还车验证码蒙层
				showmask_cancel:false,//取消驳回蒙层
				carry:"",//提车&还车验证码
				showmask_submit:false,//提交上级蒙层
				showmask_exc:false,//换车蒙层
				reason_exc:"",//换车理由
				kind:"",//换车种类
				date: currentDate,
				date1: currentDate,
				time: '00:00',
				time1:currentTime,
				token:this.$store.state.logindata.token,
				url:this.$store.state.url,
				perList:[],//使用人员列表
				car_nameList:[],//车牌号列表
				driverList:[],//司机列表
				showPerson:"请选择使用人员",
				checking:[],//审核中 &待派车 &待审核(由我处理)
				checking2:[],//待审核(他人处理)
				checked:[],//审核结果
				history:[],//申请记录
				history2:[],//派车&审核记录
				history3:[],//审核记录(他人处理)
				okList:[],//待提车列表
				outList:[],//待还车列表
				noList:[],//已驳回列表
				okList2:[],//待提车列表(他人处理)
				outList2:[],//待还车列表(他人处理)
				noList2:[],//已驳回列表(他人处理)
				vgo:"",//出发
				vto:"",//目的地
				vuse:"",//用途
				
				item:"",//当前选择用车调度项的内容
				col1:-1,//车牌号索引
				col2:-1,//司机索引
				isios,
			}
		},
		computed:{
			//使用人员显示列表
			perMid(){return this.perList.filter(function(item){return item.active;});},
			isshowchecking(){if(this.checking.length){return false}else{return true}},
			isshowchecked(){if(this.checked.length){return false}else{return true}},
			isshowhistory(){if(this.history.length){return false}else{return true}},
		}, 
		watch:{
			perMid(v){
				if(v.length){var name = "";this.perMid.forEach((item,i)=>{name = name+item.name+" "});this.showPerson = name;}
				else{this.showPerson="请选择使用人员"}
			},
		},
		onUnload(){console.log("unload")},
		onLoad() {
			console.log("load");
			if(this.index=="0"){
				this.requestPerson();
				this.requestCheck();
				this.requestHistory();
			}else if(this.index=="1"){this.requestAll()
			}else if(this.index=="2"){
				this.requestAll2();
			};
		},
		onNavigationBarButtonTap(){
			uni.reLaunch({
				url:'/pages/dispatch/dispatch',
				success:function(){console.log("刷新成功");}
			})
		},
		methods: {
			//历史记录之状态显示
			status(v){
				if(v=="0"){return "申请中"
				}else if(v=="no"){return "申请驳回"
				}else if(v=="in"){return "已完成"
				}else if(v=="out"){return "已提车"
				}else if(v=="ok"){return "申请通过"}
			},
			status2(v){
				if(v=="0"){return "待派车"
				}else if(v=="no"){return "已驳回"
				// }else if(v=="in"){return "已完成"
				// }else if(v=="out"){return "已提车"
				}else if(v=="ok"){return "已通过"}
			},
			change(e){this.i = e.detail.current},
			leftChange(i) {this.i = i;},
			//请求使用人员
			requestPerson(){
				var that = this;
				uni.request({url:this.url +"/car_apply/",method:"GET",header:{"authorization":this.token,},sslVerify:false,
					success:(res) => {
						if(res.data.code == 1000){
							console.log("使用人员请求成功");
							that.perList = [];
							res.data.data.forEach((item)=>{that.perList.push({name:item.name,phone:item.phone,active:false})});
						}else{console.log(res);}
					},
					fail:(res)=>{console.log(res);},
				});
			},
			//改变申请记录项的显示状态
			changeshowStatus(a,i){
				this.$set(this.history[i],'showStatus',!a);},
			changeshowStatus2(a,i){
				this.$set(this.history2[i],'showStatus',!a);},
			//选择使用人员
			select(item,i){item.active = !item.active;},
			//清空使用人员
			clear(){this.perList.forEach((item,i)=>{item.active=false;})},
			changeDate: function(e) {this.date = e.target.value;},
			changeDate1: function(e) {this.date1 = e.target.value;},
			changeTime: function(e) {this.time = e.target.value;},
			changeTime1: function(e) {this.time1 = e.target.value;},
			getDate() {
				var date = new Date();
				let year = date.getFullYear();let month = date.getMonth() + 1;let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getTime() {
				var date = new Date();
				let hours =  date.getHours();let minuter =  date.getMinutes();
				hours = hours > 9 ? hours : '0' + hours;;
				minuter = minuter > 9 ? minuter : '0' + minuter;
				return `${hours}:${minuter}`;
			},
			send(){//发送派车申请
				var that = this;
				if (!this.vgo) {
					uni.showToast({icon:'none',title:'请输入出发地'});
				}else if (!this.vto) {
					uni.showToast({icon:'none',title:'请输入目的地'});
				}else if (!this.vuse){
					uni.showToast({icon:'none',title:'请输入车辆用途'});
				}else if (this.showPerson=="请选择使用人员") {
					uni.showToast({icon:'none',title:'请选择使用人员'});
				}else{
					var s_time = that.date+" "+that.time+":00";
					var e_time = that.date1+" "+that.time1+":00";
					var person_name = [],phone = [];
					that.perMid.forEach((item,i)=>{person_name.push(item.name);phone.push(item.phone);})
					var data ={"what":"apply","apply_data":{
						    "destination":that.vto,"departure":that.vgo,"car_use":that.vuse,
						    "person_name":person_name, "phone":phone,
						    "s_car_time":s_time,"e_car_time":e_time,
					}};
					// console.log(data);
					uni.request({url:that.url +"/car_apply/",method:"POST",header:{"authorization": that.token,"key":"application"},data:data,sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000){
							uni.showModal({title:'申请用车',content:res.data.data.msg,showCancel:false});
							that.vto="";that.vgo="";that.vuse="";
							that.perList.forEach((item,i)=>{item.active=false;});
							that.requestCheck();
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
					});
				}
			},
			requestCheck(){ //查看派车申请状态
			var that = this;
				uni.request({url:this.url +"/car_apply/",method:"POST",header:{"authorization": this.token,"key":"application"},data:{"what":"apply_status"},sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000){
						// console.log(res); 
						var all = res.data.data;
						that.checking = all.filter((item,i)=>{return item.apply_status == "审核中"});
						that.checked = all.filter((item,i)=>{return item.apply_status != "审核中"});
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			requestHistory(){//查看申请记录
			    var that = this;
				uni.request({url:this.url +"/car_apply/",method:"POST",header:{"authorization": this.token,"key":"application"},data:{"what":"history"},sslVerify:false,
				    success: (res) => {
					    if (res.data.code == 1000){	
							// console.log(res);
						    that.history = res.data.data;
					    }else{
						    var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};console.log(error);
				}}})
			},
			requestDispatchHistory(url){//查看派车记录 &审核记录
			    var that = this; 
				uni.request({url:this.url+url,method:"POST",header:{"authorization": this.token},data:{"what":"check","type_check":"check_history"},sslVerify:false,
				    success: (res) => {
					    if (res.data.code == 1000){	
							// console.log(res);
							that.history2 = res.data.data;
					    }else{
						    var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};console.log(error);
				}}})
			},
			requestReq(){ //查看新的派车申请
			    var that = this;
				uni.request({url:this.url +"/car_operation_dispatcher/?type=0",method:"GET",header:{"authorization": this.token,"key":"dispatcher"},sslVerify:false,
				    success: (res) => {
					    if(res.data.code == 1000){
						    // console.log(res);
							console.log("待派车:"+res.data.data.apply_now_list.length);
						    that.checking = res.data.data.apply_now_list;
						    that.car_nameList = res.data.data.car_dict.idle;
						    that.driverList = res.data.data.driver_all_list;
					    }else{
						    console.log(res);var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};
						    uni.showToast({title:error,icon:"none",duration:2000});
					    }
				    },
				    fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			requestAll(){
				//请求新的申请 & 请求已通过 & 请求待还车 &请求已驳回
				this.requestReq();
				var timer1=setTimeout(()=>{this.requestTri("ok");clearTimeout(timer1)},100);
				var timer2=setTimeout(()=>{this.requestTri("out");clearTimeout(timer2)},200);
				var timer3=setTimeout(()=>{this.requestTri("no");clearTimeout(timer3)},300);
				var timer4=setTimeout(()=>{this.requestDispatchHistory("/car_operation_dispatcher/");clearTimeout(timer4)},400);
			},
			requestAll2(){
				this.auditor_get()
				var timer1=setTimeout(()=>{this.auditor_get3("ok");clearTimeout(timer1)},100);
				var timer2=setTimeout(()=>{this.auditor_get3("out");clearTimeout(timer2)},200);
				var timer3=setTimeout(()=>{this.auditor_get3("no");clearTimeout(timer3)},300);
				var timer4=setTimeout(()=>{this.requestDispatchHistory("/car_operation_auditor/");clearTimeout(timer4)},400);
			},
	        //提交上级
			submitUp1(v){this.item = v;this.showmask_submit =true;},
			confirm_submit(){
				var that = this;
				var data ={"what":"check","type_check":"apply_submit","apply_data":{"apply_id":that.item.id,"department_name":that.item.department_name}};
				uni.request({
					url:that.url +"/car_operation_dispatcher/",
					method:"POST",header:{"authorization": that.token},data:data,sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000){
							that.showmask_submit=false;
							uni.showModal({title:'提交上级',content:res.data.data.msg,showCancel:false});
							that.requestAll();
						}else{console.log(res);var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};uni.showToast({title:error,icon:"none",duration:2000});}},
					fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); },
				});
			},
			//点击派车
			dispatchFirst(v){this.item = v;this.col1=-1;this.col2=-1;this.showmask = true;},
			//选择车牌  选择司机
			changecol1(v){this.col1=v},changecol2(v){this.col2=v},
			//确定车牌和司机
			confirm(url){
				var that = this;
				if(this.col1==-1) {uni.showToast({icon:'none',title:'请选择车辆'});
				}else if(this.col2==-1){uni.showToast({icon:'none',title:'请选择司机'});
				}else if(this.car_nameList[this.col1].free_position=="0"){uni.showToast({icon:'none',title:'车辆无座，请重新选择'});
				}else{
					var data ={"what":"apply_operate","operate":"apply_on",
					           "apply_data":{"apply_id":that.item.id,"department_name":that.item.department_name,
							   "car_name":that.car_nameList[that.col1].car_name,"driver":that.driverList[that.col2],}};
					// console.log(data); 
					uni.request({url:that.url+url,method:"POST",header:{"authorization": that.token,"key":"application"},data:data,sslVerify:false,
					    success: (res) => {
						    if(res.data.code == 1000){
								that.showmask=false;
							    uni.showModal({title:'派车',content:res.data.data.msg,showCancel:false});
								if(url=="/car_operation_auditor/"){that.requestAll2();return}
								that.requestAll();
						    }else{
							    console.log(res);var error = "错误码:"+res.statusCode;
							    if(res.data.code){error=res.data.error};
							    uni.showToast({title:error,icon:"none",duration:2000});
						    }
					    },
					    fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
					});
				}
			},
			//点击驳回
			refuse1(v){this.item = v;this.refuse_cause = "";this.showmask_refuse =true;},
			confirm_refuse(url){ 
				var that = this;var marker = "";
				if(!that.refuse_cause){marker = "无"}else{marker = that.refuse_cause};
				var data ={"what":"apply_operate","operate":"apply_no","apply_data":{
					"apply_id":that.item.id,"department_name":that.item.department_name,"remark":marker}};
				console.log(url);console.log(data);
				uni.request({url:that.url+url,method:"POST",header:{"authorization": that.token},data:data,sslVerify:false,
				    success: (res) => {
					    if(res.data.code == 1000){
						    that.showmask_refuse=false;
						    uni.showModal({title:'驳回',content:res.data.data.msg,showCancel:false});
						    if(url=="/car_operation_auditor/"){that.requestAll2();return}
							that.requestAll();
						}else{
						    console.log(res);var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};
						    uni.showToast({title:error,icon:"none",duration:2000});
					    }
				    },
				    fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			requestTri(v){ //查看待提车列表，待还车列表，已驳回列表
			    var that = this;
				uni.request({url:this.url +"/car_operation_dispatcher/?type="+v,method:"GET",header:{"authorization": this.token,"key":"dispatcher"},sslVerify:false,
				success: (res) => {
					if(res.data.code == 1000){
						// console.log(res.data.data);
						if(v=="ok"){that.okList = res.data.data.apply_now_list;
						console.log("==已通过:"+res.data.data.apply_now_list.length);
						}else if(v=="out"){that.outList = res.data.data.apply_now_list;
						console.log("==已提车:"+res.data.data.apply_now_list.length);
						}else if(v=="no"){that.noList = res.data.data.apply_now_list;
						console.log("已驳回列表:"+res.data.data.apply_now_list.length);};
					}else{var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};console.log(error);}
				},
				fail:(res)=>{console.log(res);}
				});
			},
			//点击提车 点击验证提车码 发送提车请求
			click_carry(){this.carry="";this.showmask_carry= true;},
			confirm_carry(url){
				var that = this;
				if (!this.carry){uni.showToast({icon:'none',title:'请输入提车验证码'});return};
				uni.request({url:that.url +url,method:"POST",header:{"authorization": that.token},data:{"what":"back_get","num":this.carry},sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000){
						that.showmask_carry=false;
						if(url=="/car_operation_auditor/"){that.carry_car(res.data.data.apply_data[0],"/car_operation_auditor/");return}
						that.carry_car(res.data.data.apply_data[0],"/car_operation_dispatcher/");
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			carry_car(v,url){
				var that = this; 
				var person = v.person_name.slice(1,v.person_name.length-1).split(",")[0];
				var p =person.slice(1,person.length-1);
				var data ={"what":"back_get","out_or_in":"out","type_data":{
					"apply_id":[v.id],"car_num":v.apply_car,"department_name":v.department_name,
					"picker":[v.department_name,p],"driver":v.driver}};
				uni.request({url:that.url +url,method:"POST",header:{"authorization": that.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000){
						uni.showModal({title:'提车',content:res.data.data.msg,showCancel:false});
						if(url=="/car_operation_auditor/"){that.requestAll2();return}
						that.requestAll();
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			//点还车走一遍
			click_return(){this.carry="";this.showmask_return= true;},
			confirm_return(url){
				var that = this;
				if (!this.carry){uni.showToast({icon:'none',title:'请输入还车验证码'});return};
				uni.request({
					url:that.url +url,method:"POST",
					header:{"authorization": that.token},
					data:{"what":"back_get","num":this.carry},sslVerify:false,
					success: (res) => {
						if (res.data.code == 1000){
							that.showmask_return=false;
							if(url=="/car_operation_auditor/"){that.return_car(res.data.data.apply_data[0],"/car_operation_auditor/");return}
							that.return_car(res.data.data.apply_data[0],"/car_operation_dispatcher/");
						}else{console.log(res);
						var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail:(res)=>{
						uni.showToast({title:"请检查网络",icon:"none",duration:2000}); 
					},
				});
			},
			return_car(v,url){
				var that = this; 
				var person = v.person_name.slice(1,v.person_name.length-1).split(",")[0];
				var p =person.slice(1,person.length-1);
				var data ={"what":"back_get","out_or_in":"in","type_data":{
					"apply_id":[v.id],"car_num":v.apply_car,"department_name":v.department_name,
					"picker":[v.department_name,p],"driver":v.driver}};
				uni.request({url:that.url +url,method:"POST",header:{"authorization": that.token},data:data,sslVerify:false,
				success: (res) => {
					if (res.data.code == 1000){
						uni.showModal({title:'还车',content:res.data.data.msg,showCancel:false});
						if(url=="/car_operation_auditor/"){that.requestAll2();return}
						that.requestAll();
					}else{
						console.log(res);var error = "错误码:"+res.statusCode;
						if(res.data.code){error=res.data.data.error};
						uni.showToast({title:error,icon:"none",duration:2000});
					}
				},
				fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			//换车
			exchange(v,kind){this.item = v;this.reason_exc="";this.col1=-1;this.col2=-1;this.showmask_exc= true;this.kind=kind},
			confirm_exc(url){
				var that = this;var v = this.item;var kind = this.kind;
				if(this.col1==-1) {uni.showToast({icon:'none',title:'请选择车辆'});
				}else if(this.car_nameList[this.col1].free_position=="0"){uni.showToast({icon:'none',title:'车辆无座，请重新选择'});
				}else{
					var reason="";
					if(!that.refuse_cause){reason = "无"}else{reason = that.refuse_cause};
					var person = v.person_name.slice(1,v.person_name.length-1).split(",")[0];
					var p =person.slice(1,person.length-1);
					var data ={"what":"edit_apply","car_status":kind,
					           "edit_data":{"apply_id":v.id,"car_name":that.car_nameList[that.col1].car_name,"reason":reason,
							   "picker":[v.department_name,p]}}; 
					console.log(data);
					uni.request({url:that.url +"/car_operation_edit/",method:"POST",header:{"authorization": that.token,"key":"application"},data:data,sslVerify:false,
					    success: (res) => {
						    if(res.data.code == 1000){
								that.showmask_exc=false;
							    uni.showModal({title:'换车',content:res.data.data.msg,showCancel:false});
								if(url=="/car_operation_auditor/"){that.requestAll2();return}
								that.requestAll();
						    }else{
							    console.log(res);var error = "错误码:"+res.statusCode;
							    if(res.data.code){error=res.data.error};
							    uni.showToast({title:error,icon:"none",duration:2000});
						    }
					    },
					    fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
					});
				}
			},
			//取消驳回
			cancel(v,kind){this.item = v;this.showmask_cancel= true;},
			confirm_cancel(url){
				var that = this;
				var data ={"what":"edit_reject","reject_id":this.item.id};
				uni.request({url:that.url +"/car_operation_edit/",method:"POST",header:{"authorization": that.token,"key":"application"},data:data,sslVerify:false,
					success: (res) => {
						if(res.data.code == 1000){
							that.showmask_cancel=false;
							uni.showModal({title:'取消驳回',content:res.data.data.msg,showCancel:false});
							if(url=="/car_operation_auditor/"){that.requestAll2();return}
							that.requestAll();
						}else{
							console.log(res);var error = "错误码:"+res.statusCode;
							if(res.data.code){error=res.data.error};
							uni.showToast({title:error,icon:"none",duration:2000});
						}
					},
					fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			//审核员的get请求
			auditor_get(){ 
			    var that = this;
				uni.request({url:this.url +"/car_operation_auditor/?type=0",method:"GET",header:{"authorization": this.token,"key":"auditor"},sslVerify:false,
				    success: (res) => {
					    if(res.data.code == 1000){
						    // console.log(res);
							console.log("由我处理待派车:"+res.data.data.user_list.length);
							console.log("待派车:"+res.data.data.apply_now_list.length);
						    that.checking = res.data.data.user_list;
							that.checking2 = res.data.data.apply_now_list;
						    that.car_nameList = res.data.data.car_dict.idle;
						    that.driverList = res.data.data.driver_all_list;
					    }else{
						    console.log(res);var error = "错误码:"+res.statusCode;
						    if(res.data.code){error=res.data.error};
						    uni.showToast({title:error,icon:"none",duration:2000});
					    }
				    },
				    fail:(res)=>{uni.showToast({title:"请检查网络",icon:"none",duration:2000}); }
				});
			},
			//审核员的get请求3
			auditor_get3(v){ 
			    var that = this;
				uni.request({url:this.url +"/car_operation_auditor/?type="+v,method:"GET",header:{"authorization": this.token,"key":"auditor"},sslVerify:false,
				success: (res) => {
					if(res.data.code == 1000){
						// console.log(res.data.data);
						if(v=="ok"){
							// that.okList = res.data.data.user_list;
							that.okList = res.data.data.apply_now_list;
						    console.log("==已通过:"+res.data.data.apply_now_list.length);
						}else if(v=="out"){
							// that.outList = res.data.data.user_list;
							that.outList = res.data.data.apply_now_list;
						    console.log("==已提车:"+res.data.data.apply_now_list.length);
						}else if(v=="no"){
							// console.log(res);
							// that.noList = res.data.data.user_list;
							that.noList = res.data.data.apply_now_list;
							// console.log(res);
						    console.log("已驳回列表:"+res.data.data.apply_now_list.length);};
					}else{var error = "错误码:"+res.statusCode;if(res.data.code){error=res.data.error};console.log(error);}
				},
				fail:(res)=>{console.log(res);}
				});
			},
			
		}
	}
</script>

<style>
.page {display:block;width: 750rpx;}
.m-cell{
	z-index: 100;
	position: fixed;
	width:100%;
	background-color:#fff;
	box-shadow:1px 1px 6px #aaa;
	padding:20rpx 0;
	justify-content:space-between;	
}
.m-pick {
	flex: 1 0 30px;
	justify-content: center;
	align-items: center;
	margin:0 20rpx;
	color: #444;
	font-size: 36rpx;
}
.maskmask{
	position:absolute;
	background-color:rgba(0,0,0,0.5);
	z-index:99;
	top:0;right:0;left:0;bottom:0; 
}
.m-swiper{padding-top:100rpx;height:100%;box-sizing:border-box;}
.no-content{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	margin-top:60rpx;
	width:750rpx;
}
.no-content2{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	margin-top:60rpx;
	width:750rpx; 
	position:absolute;
	z-index:-10;
}
.no-content3{
	justify-content:center;
	align-items:center;
	font-size:34rpx;
	color:#808080;
	width:670rpx;
	top:48rpx;
	z-index:-1;
	position:absolute;
}
.row{
	padding:16rpx 30rpx;
	align-items:center;
}
.my-input{
	background: #e2f5fc;
	width:460rpx;
	/* height:62rpx; */
	border-radius: 16upx;
	padding: 18rpx 40upx;
	font-size:36rpx;
	letter-spacing:0.5px;
}
.my-input2{
	background: #efefef; 
	width:540rpx;
	border-radius: 16upx;
	padding: 18rpx 40upx;
	font-size:36rpx;
	letter-spacing:0.5px;
}
.multi-list{
	display:block;
	margin:510rpx 30rpx auto 160rpx;
	width:560rpx;
	height:422rpx;
	padding:20rpx 22rpx 0;
	background-color:#fff;
	border-radius:10px; 
	box-shadow:1px 1px 6px #aaa;
}
.multi-list2{ 
	display:block;
	margin:30% auto;
	width:650rpx;
	height:548rpx;
	padding:0 16rpx;
	background-color:#fff;
	border-radius:10px; 
	box-shadow:1px 1px 6px #aaa;
}
.multi-list3{ 
	display:block;
	margin:44% auto;
	width:622rpx;
	height:320rpx;
	padding:0 30rpx;
	background-color:#fff;
	border-radius:10px; 
	box-shadow:1px 1px 6px #aaa;
}
.col-1{
	display:block;
	height:286rpx;
	width:358rpx; 
	overflow:auto;
	border:1px solid #aaa;
}
.col-2{
	display:block;
	height:286rpx;
	width:270rpx;
	overflow:auto;
	border:1px solid #aaa;
}
.col-3{
	display:block;
	height:286rpx;
	width:600rpx; 
	overflow:auto;
	border:1px solid #aaa;
}
.multi-item{
	margin:16rpx 0;
	padding:10rpx 30rpx;
	align-items:center;
}
.multi-item2{
	margin:16rpx 0;
	padding:10rpx 0 10rpx 6rpx;
	align-items:center;
}
.multi-item2-left{
	width:278rpx;
	overflow:hidden;white-space:nowrap;text-overflow:ellipsis;
}
.my-frame{margin:30rpx auto;}
.my-line{border-bottom:1px solid #C8C7CC;margin:0 30rpx 6rpx;}
.item-top{
	padding:16rpx;
	position:relative;
	justify-content:center;
	align-items:center;
	font-weight:700;
}
.item-top-history{
	padding:16rpx 30rpx;
	align-items:center;
	font-weight:700;
}
.item-top-right{
	margin-left:16rpx;
	color:#00B26A;
	position:absolute;
	top:16rpx;right:40rpx
}
.item-left{
	font-size:34rpx;
	font-weight:700;
	padding:0 30rpx;
}
.item-more{
	font-size:32rpx;
	padding:0 30rpx;
}
.item-bottom{
	font-size:32rpx;
	padding:0 30rpx 14rpx;
	/* color:#808080; */
}
.item-between{
	padding:10rpx 20rpx 24rpx;
	/* justify-content:space-around; */
}
.mini-btn{
	padding:0;
	width:150rpx;
	height:70rpx;
	font-size:30rpx;
	display:flex;
	justify-content:center;
	align-items:center;
}
.grey{color:#aaaaaa}
.active{color:#007AFF}
.active2{background-color:#dedede}
.active3{color:#333}
.active4{color:#6699ff}
</style>
