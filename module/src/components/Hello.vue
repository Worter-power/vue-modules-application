<template>
  <div>
    <h1>表格下载</h1>
    <button  v-download="{table:true}">原生表格下载</button>
    <table :data-download-options="JSON.stringify({title:'2222',fileName:'333'})">
      <tr>
        <td>11111111111111</td>
        <td>22222</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    created(){
        console.log(this.$store.state)
    }
}
</script>