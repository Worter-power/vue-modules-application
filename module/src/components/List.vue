<template>
	<div>
		<h1>List</h1>
 		<button @click="handleInfo">有人想加你为好友</button>
	</div>
</template>

<script>
export default {
    methods: {
		handleInfo(){
			this.$win({
				title: 'Harry,你好！',
				body: "您有8条代办消息",
				icon: 'http://1.shiyuesoft.com/api/storage/show/unit/c64ed55e-2150-4076-8ff9-01991704d950'
			})
		}
	},
	mounted(){
		this.$win()
	}
}
</script>