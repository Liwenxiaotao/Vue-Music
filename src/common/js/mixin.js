import {mapGetters} from 'vuex'
export const playingMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlayList(this.playlist)
  },
  activated() {
    this.handlePlayList(this.playlist)
  },
  watch: {
    playlist(newValue) {
      this.handlePlayList(newValue)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
