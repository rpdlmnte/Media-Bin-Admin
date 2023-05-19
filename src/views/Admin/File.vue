<template>
  <div>
    <!-- Body Card -->
    <el-card shadow="hover" class="menuCard">
      <!-- Top Level Menu -->
      <el-row class="item">
        <el-col class="titleHeader" :span="3">
          <div
            :style="`font-size: var(--el-font-size-extra-large); text-align: left`"
          >
            <el-icon><Folder /></el-icon>
            Folder
          </div>
        </el-col>
      </el-row>

      <div class="bodyContent">
        <div class="tableContent">
          <el-table
            :data="listOfFileUpload"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column label="File" prop="file">
              <span>{{ form.appId }}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { Folder } from "@element-plus/icons";
import appId from "@/configuration/appStore";

export default defineComponent({
  name: "Files",
  components: {
    Folder,
  },
  data() {
    return {
      listOfFileUpload: null,

      form: reactive({
        appId: null,
        // restrictionId: null,
        // sectionId: null,
        // maxFileSize: "",
        // resWidth: "",
        // resHeight: "",
        // width: "",
        // height: "",
        // sectionName: "",
        // applicationName: "",
      }),
    };
  },
  methods: {
    async getFileUpload() {
      await api.get(`FileUpload${Id}`).then((response) => {
        this.listOfFileUpload = response.data;
        console.log(this.listOfFileUpload);
      });
    },
  },
  created() {
    this.getFileUpload();
  },
});
</script>

<style lang="scss" scoped>
.item {
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.menuCard {
  min-height: 50vh;
  max-height: calc(92vh - 32px);
  overflow: hidden;
}

.tableContent {
  max-height: calc(82vh - 32px);
  overflow: auto;
}

.bodyContent {
  padding-top: 0.5rem;
}
.newButton {
  text-align: end;
}
</style>
