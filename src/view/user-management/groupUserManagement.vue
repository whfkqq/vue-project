<template>
  <div class="wrapper">
    <Row :gutter="30">
      <i-col span="6">
        <group-management></group-management>
      </i-col>
      <i-col span="18">
        <user-list></user-list>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import GroupManagement from './components/GroupManagement'
  import userList from './components/userList'
  export default {
    components: {
      GroupManagement,
      userList
    },
    data () {
      return {
        allUsersList: []
      }
    },
    methods: {
    },
    mounted () {
      this.$nextTick(() => {
        this.getAllUsersList()
      })
    }
  }
</script>

<style scoped>

</style>
