<template>
  <div>
    <NavigationBar></NavigationBar>
    <SelectionBuyAndSell></SelectionBuyAndSell>
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import SelectionBuyAndSell from '@/components/SelectionBuyAndSell.vue';

export default {
  name: 'BuyingAndSellingView',
  components: {
    NavigationBar,
    SelectionBuyAndSell,
  },
  data() {
  },
};
</script>

<style scoped>
/* Aquí va tu CSS */
</style>
