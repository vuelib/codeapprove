<template>
  <div id="app">
    <button 
      id="test-btn"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Hello World
    </button>

    <HelloWorld msg="Welcome to Diff Machine"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
