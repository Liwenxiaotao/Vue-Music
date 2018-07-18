<!-- 歌手详情页 -->
<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
  created() {
    console.log(this.singer)
  },
  components: {},
  watch: {},
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  mounted() {},
  methods: {}
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.singer-detail
  position: fixed
  top: 0
  left: 0
  right: 0
  background: #eeeeee
  bottom: 0
  z-index: 100
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
