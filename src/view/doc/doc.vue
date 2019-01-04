<style lang="less">
  @import "common.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <Row>
        <Button type="primary" icon="md-arrow-round-up" @click="forUpload">上传文件</Button>
        &nbsp;
        <Button @click="forCreateFolder">新建文件夹</Button>
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

    <Modal v-model="folder.modal" scrollable title="请输入文件夹名称" @on-ok="createFolder">
      <Input ref="folder_input" v-focus v-model="folder.input" placeholder="请输入文件夹名称" />
    </Modal>

    <Modal v-model="rename.modal" scrollable title="请输入文件名" @on-ok="doRename">
      <Input ref="rename_input" v-focus v-model="rename.input" placeholder="请输入文件名" />
    </Modal>

    <Modal v-model="move.modal" scrollable title="移动到" @on-ok="doMove">
      <Tree ref="move_tree" :data="move.treeData" :render="renderTree" :loading="move.loading" :load-data="loadTree"></Tree>
    </Modal>

    <Modal v-model="upload.modal" footer-hide="true" scrollable title="文件上传" width="872" @on-cancel="closeUpload">
      <Row>
        <Col span="3">
          <div id="filePicker">选择文件</div>
        </Col>
        <Col span="6">
          <Alert show-icon>上传文件大小限制2G</Alert>
        </Col>
      </Row>
      <div ref="upload_panel" class="file-panel">
        <h2>文件列表</h2>
        <div class="file-list">
          <ul class="file-item" :class="`file-${file.id}`" v-for="file in upload.fileList">
            <li class="file-name">{{file.name}}</li>
            <li class="file-size">{{fileSize(file.size)}}</li>
            <li class="file-status">{{file.desc}}</li>
            <li class="file-operate">
              <a title="移除" @click="removeUpload(file)"><Icon type="md-close"></Icon></a>
            </li>
            <li class="progress" v-bind:style="{ width: file.progress + '%' }"></li>
          </ul>
          <div class="no-file" v-if="!upload.fileList.length">暂无待上传的文件</div>
        </div>
      </div>
    </Modal>

    <Modal v-model="share.modal" scrollable title="分享链接" footer-hide="true">
      <Alert type="success">{{ share.input }}</Alert>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import docApi from '@/api/doc.js'
import $ from '@/assets/jquery-vendor.js'
import md5 from '@/assets/webuploader/md5.js'
import '@/assets/webuploader/webuploader.js'

export default {
  components: { Tables },
  data: function () {
    return {
      loading: false,
      parentId: '#',
      filePathArray: [
        { parentId: '#', parentName: '根目录'}
      ],
      folder: {
        modal: false,
        input: ''
      },
      rename: {
        modal: false,
        fileId: '',
        input: ''
      },
      move: {
        modal: false,
        fileId: '',
        selected: {},
        treeData: [{
          title: '根目录',
          parentId: '#',
          loading: false,
          children: []
        }]
      },
      upload: {
        modal: false,
        chunkSize: 5 * 1024 * 1024,
        uploader: null,
        fileList: [],
        uploaded: false
      },
      share: {
        modal: false,
        input: ''
      },
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
          title: '时间',
          key: 'createTm',
          align: 'right',
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
            },
            (h, params, vm) => {
              return ' '
            },
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                attrs: {
                  title: '移动'
                },
                on: {
                  'click': () => {
                    this.forMove(params);
                  }
                }
              }, '移动')
            },
            (h, params, vm) => {
              return ' '
            },
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                attrs: {
                  title: '重命名'
                },
                on: {
                  'click': () => {
                    this.forRename(params);
                  }
                }
              }, '重命名')
            },
            (h, params, vm) => {
              return ' '
            },
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    this.deleteFile(params);
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  attrs: {
                    title: '删除'
                  }
                }, '删除')
              ])
            },
            (h, params, vm) => {
              return ' '
            },
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                attrs: {
                  title: '分享'
                },
                on: {
                  'click': () => {
                    this.forShare(params);
                  }
                }
              }, '分享')
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
      docApi.getFileList({
        parentId : this.parentId,
        fileStatus : '01',
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
    forCreateFolder() {
      this.folder.input = '';
      this.folder.modal = true;
      this.$nextTick(() =>{
        this.$refs.folder_input.focus()
      });
    },
    createFolder() {
      if (!this.folder.input.trim()){
        this.$Message.error('请输入文件夹名称');
        return;
      }
      docApi.createFolder({
        parentId : this.parentId,
        fileName : this.folder.input
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.getFileList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }
      })
    },
    forRename(params) {
      this.rename.fileId = params.row.fileId;
      this.rename.input = params.row.fileName;
      this.rename.modal = true;
      this.$nextTick(() =>{
        this.$refs.rename_input.focus()
      });
    },
    doRename() {
      if (!this.rename.input.trim()){
        this.$Message.error('请输入文件名');
        return;
      }
      docApi.rename({
        fileId : this.rename.fileId,
        fileName : this.rename.input
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.$Message.info(response.data.msg);
            this.getFileList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }
      })
    },
    forMove(params) {
      this.move.treeData = [{
        title: '根目录',
        parentId: '#',
        loading: false,
        children: []
      }];
      this.move.fileId = params.row.fileId;
      this.move.selected = {};
      let dom = document.getElementsByClassName("ivu-tree-title-selected");
      if (dom[0]) {
        dom[0].className = 'ivu-tree-title';
      }
      this.move.modal = true;
    },
    doMove() {
      if (!this.move.selected.parentId) {
        this.$Message.error('请选择目标文件夹');
        return;
      }
      docApi.move({
        fileId : this.move.fileId,
        moveTo : this.move.selected.parentId
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.$Message.info(response.data.msg);
            this.getFileList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }
      })
    },
    renderTree(h, { root, node, data }) {
      return h('span', {
        class: 'ivu-tree-title',
        on: {
          click: event => {
            this.move.selected = node.node;
            let dom = document.getElementsByClassName("ivu-tree-title-selected");
            if (dom[0]) {
              dom[0].className = 'ivu-tree-title';
            }
            if(event.target.className == 'ivu-tree-title'){
              event.target.className = 'ivu-tree-title ivu-tree-title-selected';
            }else{
              event.target.parentNode.className = 'ivu-tree-title ivu-tree-title-selected';
            }
          }
        }
      }, [
      h('Icon', {
        props: {
          type: 'md-folder',
          size: 20
        }
      }),
      h('span', ' ' + data.title)
    ]);
    },
    loadTree(params, callback) {
      docApi.getFileList({
        parentId : params.parentId,
        fileType: '01',
        fileStatus : '01'
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            let children = [];
            let data = response.data.result;
            for (let i = 0; i < data.length; i++) {
              let child = {};
              child.title = data[i].fileName;
              child.parentId = data[i].fileId;
              child.loading = false;
              child.children = [];
              children.push(child);
            }
            callback(children);
          }
        }
      });
    },
    deleteFile(params) {
      docApi.delete({
        fileId : params.row.fileId
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.$Message.info(response.data.msg);
            this.getFileList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }
      })
    },
    download(params) {
      window.open(docApi.formatDownloadUrl(params.row.fileId), '_blank');
    },
    forUpload() {
      this.upload.modal = true;
      this.upload.fileList = [];
      this.upload.uploaded = false;
      if (!this.upload.uploader) {
        this.initWebUploader();
      }
    },
    initWebUploader() {
      WebUploader.Uploader.register({
        "before-send-file" : "beforeSendFile",
        "before-send" : "beforeSend",
        "after-send-file" : "afterSendFile"
      }, {
        beforeSendFile : (file) => {
          let task = new $.Deferred();
          (new WebUploader.Uploader()).md5File(file, 0, 10 * 1024 * 1024).progress(function(percentage) {
            this.fileProgress(file, '校验中...')
          }).then((val) => {
            file.md5 = val;
            docApi.md5Check4Upload({
              parentId : this.parentId,
              name : file.name,
              type : file.type,
              size : file.size,
              ext : file.ext,
              md5 : file.md5
            }).then((response) => {
              if (response.status == 200 && response.data.code === '0000') {
                  task.reject();
                  this.upload.uploader.skipFile(file);
                  this.finishUpload(file);
              } else {
                task.resolve();
              }
            }).catch(function (error) {
              task.resolve();
            });
          });
          return $.when(task);
        },
        beforeSend : (block) => {
          let task = new $.Deferred();
          if (this.upload.uploader.options.chunked) {
            docApi.chunkCheck4Upload({
              uniqueId : block.file.uniqueId,
              chunk : block.chunk,
              chunks : block.chunks,
              size : block.end - block.start
            }).then((response) => {
              if (response.status == 200 && response.data.code === '0000') {
                task.reject();
              } else {
                task.resolve();
              }
            }).catch(function (error) {
              task.resolve();
            });
          }
          return $.when(task);
        },
        afterSendFile : (file) => {
          let chunks = 0;
          if (this.upload.uploader.options.chunked && (chunks = Math.ceil(file.size / this.upload.chunkSize)) > 1) {
            let task = new $.Deferred();
            docApi.chunksMerge4Upload({
              uniqueId : file.uniqueId,
              chunks : chunks,
              parentId : this.parentId,
              name : file.name,
              type : file.type,
              size : file.size,
              ext : file.ext,
              md5 : file.md5
            }).then((response) => {
              if (response.status == 200 && response.data.code === '0000') {
                task.resolve();
                this.finishUpload(file);
              } else {
                task.reject();
              }
            }).catch(function (error) {
              task.reject();
            });
            return $.when(task);
          } else {
            this.finishUpload(file);
          }
        }
      });
      let server = docApi.baseUrl4Upload + '/file/upload';
      if (docApi.accessToken) {
        server = server + '?access_token=' + docApi.accessToken;
      }
      this.upload.uploader = WebUploader.create({
        auto: true,
        swf: '@/assets/webuploader/Uploader.swf',
        server: server,
        pick: "#filePicker",
        resize: false,
        dnd: this.$refs.upload_panel,
        disableGlobalDnd: true,
        thumb: {
          width : 100,
          height : 100,
          quality : 70,
          allowMagnify : true,
          crop : true
        },
        compress: false,
        prepareNextFile: true,
        chunked: true,
        chunkSize: this.upload.chunkSize,
        threads: 3,
        formData: {},
        fileNumLimit : 0,
        fileSizeLimit: 2 * 1024 * 1024 * 1024,
        duplicate : true
      });

      this.upload.uploader.on('fileQueued', (file) => {
        file.uniqueId = md5('' + docApi.userId + file.name + file.type + file.lastModifiedDate + file.size);
        file.progress = 0;
        file.desc = '等待上传...';
        this.upload.fileList.push(file);
      });

      this.upload.uploader.on('uploadBeforeSend', (block, data) => {
        if (docApi.userId) {
          data.userId = docApi.userId;
        }
        data.uniqueId = block.file.uniqueId;
        data.md5 = block.file.md5;
        data.ext = block.file.ext;
        data.parentId = this.parentId;
      });

      this.upload.uploader.on('uploadProgress', (file, percentage) => {
        let progress = Math.round(percentage * 10000) / 100;
        if (progress === 100) {
          progress = 99.99;
        }
        this.fileProgress(file, progress + "%", progress);
      });

      this.upload.uploader.on('error', (reason) => {
        if (reason === 'Q_EXCEED_SIZE_LIMIT') {
          this.$Message.error('所选文件大小超过限制（2G）');
        }
      });
    },
    fileSize(size) {
      return docApi.formatSize(size);
    },
    finishUpload(file) {
      this.fileProgress(file, '上传成功...', 100);
      this.upload.uploaded = true;
    },
    fileProgress(file, desc, progress) {
      for(let i = 0; i < this.upload.fileList.length; i++) {
        let uploadFile = this.upload.fileList[i];
        if (uploadFile.id === file.id) {
          uploadFile.desc = desc;
          if (progress) {
            uploadFile.progress = progress;
          }
          this.upload.fileList.splice(i,1,uploadFile);
          break;
        }
      }
    },
    removeUpload(file) {
      this.upload.uploader.cancelFile(file);
      this.upload.uploader.removeFile(file);
      for(let i = 0; i < this.upload.fileList.length; i++) {
        let uploadFile = this.upload.fileList[i];
        if (uploadFile.id === file.id) {
          this.upload.fileList.splice(i, 1);
          break;
        }
      }
    },
    closeUpload() {
      if (this.upload.uploader.isInProgress) {
        this.upload.uploader.stop();
      }
      this.upload.uploader.reset();
      if (this.upload.uploaded) {
        this.getFileList();
      }
    },
    forShare(params) {
      docApi.share({
        fileId : params.row.fileId
      }).then((response) => {
        if (response.status == 200) {
          if (response.data.code === '0000') {
            this.share.input = docApi.formatShareUrl(response.data.result.shareUrl);
            this.share.modal = true;
          } else {
            this.$Message.error(response.data.msg);
          }
        }
      })
    }
  },
  created() {
    this.getFileList();
  }
}
</script>
<style lang="css">
.webuploader-container {
  position: relative;
}
.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px,1px,1px,1px);
}
.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: #2d8cf0;
  padding: 8px 15px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.webuploader-pick-hover {
  background: #57a3f3;
}
.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events:none;
}
</style>
<style lang="less">
@h-row: 50px;
.file-panel {
  width: 840px;
  margin-top: 10px;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
  > h2 {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
  }
  .file-list {
    position: relative;
    height: 360px;
    overflow-y: auto;
    background-color: rgb(250, 250, 250);
  }
  .file-item {
    position: relative;
    height: @h-row - 1;
    line-height: @h-row - 1;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    z-index: 1;
    > li {
      display: inline-block;
      float: left;
      height: @h-row - 1;
    }
  }
  .file-name {
    padding-left: 10px;
    width: 55%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .file-size {
    padding-left: 10px;
    width: 20%;
  }
  .file-status {
    padding-left: 10px;
    width: 20%;
  }
  .file-operate {
    padding-left: 10px;
    width: 5%;
    > a {
      padding: 10px 5px;
      cursor: pointer;
      color: #666;
      &:hover {
        color: #ff4081;
      }
    }
  }
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: @h-row - 2 !important;
    width: 0;
    background-color: #E2EDFE;
    z-index: -1;
  }
  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
}
</style>
