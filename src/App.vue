<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div >
    <router-view keep-alive></router-view>
    <div class="snakeBox" v-show='this.$store.state.isLoading'>
      <mt-spinner type="snake" color="#4390E1"></mt-spinner>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {},
  created: function() {},
  mounted() {},
  watch: {},
  filters: {}
};
</script>
<style>
.snakeBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding-top: 2.8667rem;
}
</style>