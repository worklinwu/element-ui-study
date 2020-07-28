<template>
  <!--可以作为组件测试使用, 会更方便一些-->
  <div style="margin: 20px;">
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: 'Hello Element UI!'
      };
    }
  };
</script>
