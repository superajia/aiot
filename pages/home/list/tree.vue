<template>
	<view class="page">
		<mix-tree  :list="list" @treeItemClick="treeItemClick"></mix-tree>
	</view>	
</template>
<script> 
	import mixTree from '@/components/mix-tree.vue';
	export default {
			components: {mixTree},
			data() {
				return {
					list:[]
				}
			},
			onLoad() {
				console.log("load");
				this.list.push(this.$store.state.tree);
				// console.log(JSON.stringify(this.list));
			},
			methods: {
				//点击最后一级时触发该事件
				treeItemClick(item) {
					var that = this;
					let {id,name,device_id} = item;
					if(device_id){
						var end = device_id.length-2
						that.$store.commit('settm',device_id.slice(2,end));
						uni.switchTab({url:"../home"})
					}
				}
			}
		}
	</script>

<style>
</style>
