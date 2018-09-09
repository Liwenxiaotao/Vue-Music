<!-- 滚动容器 -->
<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforescroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  components: {},
  computed: {},
  mounted() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  watch: {
    data() {
      this.scroll.refresh()
    }
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let self = this
        this.scroll.on('scroll', (pos) => {
          self.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforescroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScoll')
        })
      }
    },
    enabled() {
      this.scroll && this.scroll.enabled()
    },
    disabled() {
      this.scroll && this.scroll.disabled()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}

</script>
<style scoped>
</style>
