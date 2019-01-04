<style lang="less">
  @import "common.less";
</style>
<template>
  <div style="padding: 10px;">
    <Card dis-hover>
      <Row>
        文件分享
      </Row>
    </Card>

    <Row class="margin-top-10">
      <Breadcrumb separator=">" >
        <BreadcrumbItem v-for="(item, index) in filePathArray">
          <span class="select_span" @click="handleParentId(item)">
            <Icon v-if="index==0" type="ios-home-outline"></Icon>
            <span style="cursor: pointer;">{{ item.parentName }}</span>
          </span>
        </BreadcrumbItem>
      </Breadcrumb>
    </Row>

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
      parentId: '#',
      shareUrl: this.$route.params.shareUrl,
      filePathArray: [
        { parentId: '#', parentName: '根目录'}
      ],
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
              return h('span', {
                attrs: {
                  style: "cursor: pointer;"
                },
                on: {
                  'click': () => {
                    this.handleParentId({
                      parentId: params.row.fileId,
                      parentName: params.row.fileName
                    });
                  }
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'md-folder',
                    size: 20
                  }
                }),
                h('span', ' ' + fileName)
              ])
            } else {
              return h('div',{
                attrs: {
                  style: "cursor: pointer;"
                },
                on: {
                  'click': () => {
                    this.download(params);
                  }
                }
              }, [
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
          title: '大小',
          key: 'fileSize',
          align: 'right',
          render: (h, params) => {
            return h('span', docApi.formatSize(params.row.fileSize))
          }
        },
        {
          title: '操作',
          key: 'handle',
          align: 'right',
          button: [
            (h, params, vm) => {
              if (params.row.fileType === '01') {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  attrs: {
                    title: '打开'
                  },
                  on: {
                    'click': () => {
                      this.handleParentId({
                        parentId: params.row.fileId,
                        parentName: params.row.fileName
                      });
                    }
                  }
                }, '打开')
              } else {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  attrs: {
                    title: '下载'
                  },
                  on: {
                    'click': () => {
                      this.download(params);
                    }
                  }
                }, '下载')
              }
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
      docApi.getShareUrl({
        shareUrl : this.shareUrl,
        parentId : this.parentId,
        page : this.page.page,
        size : this.page.size,
        total : 'true'
      }).then((response) => {
        this.loading = false;
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.tableData = response.data.result.items
            this.page.total = response.data.result.total
          } else {
            this.$Message.error(response.data.msg);
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
    handleParentId(params){
      this.parentId = params.parentId;
      this.page.page = 1;
      this.getFileList();
      let exists = false;
      let newPathArray = [];
      for(let i = 0; i < this.filePathArray.length; i++) {
        let filePath = this.filePathArray[i];
        newPathArray.push(filePath);
        if (filePath.parentId === this.parentId) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.filePathArray.push(params);
      } else {
        this.filePathArray = newPathArray;
      }
    },
    download(params) {
      window.open(docApi.formatDownloadUrl(params.row.fileId, this.shareUrl), '_blank');
    },
  },
  created() {
    this.getFileList();
  }
}
</script>
