<template>
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeList" :key="index">
				<view 
					class="mix-tree-item" hover-class="my-hover" :hover-stay-time="100" :hover-start-time="0"
					:style="[{
							paddingLeft: item.rank*20 + 15 +'px',
							zIndex: item.rank*-1 +50
						}]"
					:class="{
							border: true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild
						}"
					@tap="treeItemTap(item, index)">
					
					<image class="mix-tree-icon" :src="item.lastRank ? treeParams.lastIcon : (item.showChild ? treeParams.currentIcon : treeParams.defaultIcon)"></image>
					<view v-if="item.device_id"  style="position:relative;padding-left:44rpx;">
					<block v-if="item.dev_list[0][0].kind=='person_gps'"><span class="iconfont icon-left2">&#xe643;</span></block>
					<block v-else><span class="iconfont icon-left3">&#xe627;</span></block>
					{{item.name}}
					</view>
					<view v-else class="active">{{item.name}}</view>      
				</view>
			</block>
		</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default(){
					return [];
				}
			},
			params: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				treeList: [],
				treeParams: {
					defaultIcon: '/static/you.png',
					currentIcon: '/static/xia.png',
					lastIcon: '',
					border: false
				}
			}
		},
		watch: {
			list(list){
				this.treeParams = Object.assign(this.treeParams, this.params);
				this.renderTreeList(list);
			}
		},
		methods: {
			//扁平化树结构
			renderTreeList(list=[], rank=0, parentId=[]){
				list.forEach(item=>{
					this.treeList.push({
						id: item.id,
						name: item.name,
						device_id:item.device_id,
						dev_list:item.dev_list,
						parentId,  // 父级id数组
						rank,  // 层级
						showChild: false,  //子级是否显示
						show: rank === 0  // 自身是否显示
					})
					if(Array.isArray(item.children)){
						let parents = [...parentId];
						parents.push(item.id);
						this.renderTreeList(item.children, rank+1, parents);
					}else{
						this.treeList[this.treeList.length-1].lastRank = true;
					}
				})
			},
			// 点击
			treeItemTap(item){
				let list = this.treeList;
				let id = item.id;
				if(item.lastRank === true&&item.device_id){
					//点击最后一级时触发事件
					this.$emit('treeItemClick', item);
					return;
				}
				// if(item.lastRank === true&&item.device_id){
				// 	this.$emit('treeItemClick', item);
				// 	return;
				// }
				item.showChild = !item.showChild;
				list.forEach(childItem=>{
					if(item.showChild === false){
						//隐藏所有子级
						if(!childItem.parentId.includes(id)){
							return;
						}
						if(childItem.lastRank !== true){
							childItem.showChild = false;
						}
						childItem.show = false;
					}else{
						if(childItem.parentId[childItem.parentId.length-1] === id){
							childItem.show = true;
						}
					}
				})
			}
		}
	}
</script>

<style>
	.mix-tree-list{
		display: flex;
		flex-direction: column;
		background-color:#ffffff;
	}
	.mix-tree-item{
		box-sizing:border-box;
		display: flex;
		align-items: center;
		font-size: 36rpx;
		color: #000;
		/* padding-top:20rpx;
		padding-bottom:20rpx; */
		height:0;
		opacity: 0;
		/* transition: .2s; */
		position: relative;
	}
	.mix-tree-item.show{
		height: 98rpx;
		border-bottom:0.5px solid #c8c7cc;
		opacity: 1;
	}
	.mix-tree-icon{
		width: 40rpx;
		height: 40rpx;
		padding-top:8rpx;
		margin-right: 10rpx;
		opacity: .9;
	}
	
	.mix-tree-item.showchild:before{
		transform: rotate(90deg);
	}
	.mix-tree-item.last:before{
		opacity: 0;
	}
	.active{font-weight:700;}
	.icon-left2{
		position:absolute;
		top:-16rpx;
		left:-34rpx;
		color:#666;
		font-size:50rpx;
	}
	.icon-left3{
		position:absolute;
		top:12rpx;
		left:-40rpx;
		color:#666;
		font-size:24rpx;
	}
</style>
