<template>
  <div id="app" class="py-8 px-4">
    <div class="mb-4 relative">
      <span class="right-0 absolute bg-yellow-500 border-yellow-600 border-2 rounded-lg px-2">
        Status: pending
      </span>

      <h3 class="font-bold text-xl">
        owner/repo (<a class="text-blue-500" href="#">#123</a>)
      </h3>
      <p>merge <code>ss-dev-branch</code> into <code>master</code></p>

      <table class="table-auto mt-2">
        <tr>
          <td class="font-bold pr-2">reviewers</td>
          <td>johndoe, alicedoe</td>
        </tr>
        <tr>
          <td class="font-bold pr-2">cc'ed</td>
          <td>billdoe</td>
        </tr>
      </table>
    </div>

    <div class="shadow mb-4">
      <div class="bg-gray-200 font-bold rounded-t border-2 border-gray-600 px-2 py-1">
        Description
      </div>
      <div class="bg-white px-2 py-2 border-2 border-gray-500 border-t-0">
        Adding a new feature, to use it first you <code>something</code> then you <code>something else</code>.
      </div>
    </div>

    <div class="shadow mb-4">
      <div class="bg-gray-200 text-black font-bold rounded-t border-2 border-gray-600 px-2 py-1">
        Changes
      </div>
      <div class="flex bg-white px-2 py-2 border-2 border-gray-500 border-t-0">
        <span class="flex-grow font-bold">app/src/Foo.java</span>
        <span class="flex-shrink pl-2 text-green-500">Added</span>
        <span class="flex-shrink pl-2 text-green-500">+101</span>
        <span class="flex-shrink pl-2 text-red-500">-54</span>
      </div>
      <div class="flex bg-white px-2 py-2 border-2 border-gray-500 border-t-0">
        <span class="flex-grow font-bold">app/src/Bar.java</span>
        <span class="flex-shrink pl-2 text-red-500">Deleted</span>
        <span class="flex-shrink pl-2 text-green-500">+0</span>
        <span class="flex-shrink pl-2 text-red-500">-546</span>
      </div>
    </div>

    <!-- <HelloWorld msg="Welcome to Diff Machine"/> -->
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
}
</style>
