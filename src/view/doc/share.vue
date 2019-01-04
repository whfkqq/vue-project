<style lang="less">
  @import "common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10">
      <tables ref="tables" stripe editable v-model="tableData" :columns="tableColumn" :loading="loading" />
      <Page :current="page.page" :page-size="page.size" :total="page.total" @on-change="handlePage" @on-page-size-change="handlePageSize" class="margin-top-10" placement="top" show-sizer show-total show-elevator />
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables'
import docApi from '@/api/doc.js'

export default {
  components: { Tables },
  data: function () {
    return {
      loading: false,
      page: {
        page : 1,
        size : 10,
        total : 0
      },
      tableColumn: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.page - 1) * this.pageSize + 1)
          }
        },
        {
          title: '文件名',
          key: 'fileName',
          align: 'left',
          render: (h, params) => {
            let fileName = params.row.fileName;
            let fileType = params.row.fileType;
            if (fileType === '01') {
              return h('span', [
                h('Icon', {
                  props: {
                    type: 'md-folder',
                    size: 20
                  }
                }),
                h('span', ' ' + fileName)
              ])
            } else {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-document',
                    size: 20
                  }
                }),
                h('span', ' ' + fileName)
              ])
            }
          }
        },
        {
          title: '链接',
          key: 'shareUrl',
          align: 'right',
          render: (h, params) => {
            return h('span', docApi.formatShareUrl(params.row.shareUrl))
          }
        },
        {
          title: '分享时间',
          key: 'shareTm',
          align: 'right',
        },
        {
          title: '操作',
          key: 'handle',
          align: 'right',
          button: [
            (h, params, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  attrs: {
                    title: '取消分享'
                  },
                  on: {
                    'click': () => {
                      this.unshare(params);
                    }
                  }
                }, '取消分享')
            }
          ]
        }
      ],
      tableData: [ ]
    }
  },
  methods: {
    getFileList() {
      this.loading = true;
      docApi.getShareList({
        page : this.page.page,
        size : this.page.size,
        total : 'true'
      }).then((response) => {
        this.loading = false;
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.tableData = response.data.result.items
            this.page.total = response.data.result.total
          }
        }
      }).catch(function (error) {
        this.loading = false;
      });
    },
    handlePage(page) {
      this.page.page = page;
      this.getFileList();
    },
    handlePageSize(size) {
      this.page.size = size;
      this.getFileList();
    },
    unshare(params) {
      docApi.unshare({
        fileId : params.row.fileId
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.getFileList();
          }
        }
      });
    }
  },
  created() {
    this.getFileList();
  }
}
</script>
