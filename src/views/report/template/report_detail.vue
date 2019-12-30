<style>

</style>

<template>
  <div class="background-color-white exhibition" id="GL_bulk_entry">
    <div ref="report-content" id="report-content">
      <iframe id="report" :src="print_href" name="ifd"
              style="height:inherit"
              width="100%" scrolling="no"
              frameborder="0">
      </iframe>
    </div>
  </div>
</template>

<script>
  export default {
    name: "rpt_print2",
    data() {
      return {
        print_href: ''
      }
    },
    mounted() {
      this.$refs['report-content'].style.height = window.innerHeight - 160 + 'px'
      const that = this;
      window.onresize = function temp() {
        that.$refs['report-content'].style.height = window.innerHeight - 160 + 'px'
      };
      this.print_href = this.$route.params.reportUrl;
    }
  }
</script>

