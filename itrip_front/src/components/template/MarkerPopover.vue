<template lang='pug'>
.layout
  .image
    img(:src="imgSrc")
  .content
    .name {{ name }}
    .addr {{ addr }}

</template>

<script>
  export default {
    name: 'MarkerPopover',
    props: {
      name: String,
      address: Object,
      images: Array
    },
    mounted() {
      this.imgSrc = String(this.images[0]);
      this.addr = this.getAddress();
    },
    data() {
      return {
        imgSrc: '',
        addr: ''
      }
    },
    methods: {
      getAddress: function(){
        let address = '';
        let city = "";
        let suburb = "";
        let road = "";
        let number = "";
        // let comp = this.spot.address.state === "臺灣省";
        city = ((this.address.state === "臺灣省") || (this.address.state === undefined))? this.address.county: this.address.state;
        suburb = (this.address.town === undefined)? this.address.suburb: this.address.town;
        road = (this.address.road === undefined)? ((this.address.pedestrian === undefined)? "": this.address.pedestrian): this.address.road;
        number = (this.address.house_number === undefined)? "": this.address.house_number;
        if(city !== undefined) {
          address = city.concat(suburb, road, number);
          return address;
        }
      },
    },
  }
</script>

<style scope lang="sass">
.content
  display: inline-block
.image
  display: inline-block
img
  height: 50px
  width: 50px
</style>
