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
          <el-table :data="listOfApplication" style="width: 100%">
            <el-table-column label="Files" prop="file">
              <template #default="{ row }">
                <!-- <i class="fas fa-folder"></i> -->
                <div class="folder">
                  <el-icon size="100"><Folder /></el-icon>
                </div>
                <span @click="test()">{{ row.applicationName }}</span>
              </template>
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

export default defineComponent({
  name: "Files, listOfApplication",
  components: {
    Folder,
  },
  data() {
    return {
      // listOfFileUpload: "",
      listOfApplication: [],
      listOfFIles: [],
      appId: "E043610C-C656-4616-9317-FBF7685A6687",

      form: reactive({
        appId: null,
        userId: null,
        width: "",
        height: "",
        Files: "",
        isActive: "",
        applicationName: "",
        referralUrl: "",
      }),
    };
  },
  methods: {
    test() {
      ElMessage("I was clicked");
    },
    async clearForm() {
      this.grantUserVisible = false;
      this.form = {
        appId: "",
        userId: null,
        width: "",
        height: "",
        Files: "",
        isActive: "",
        applicationName: "",
        referralUrl: "",
      };
    },
    async getListOfFiles() {
      await api
        .get(`FileUpload/${this.appId}`)
        .then((response) => {
          this.listOfFiles = response.data;
          console.log("tesr", this.listOfFiles);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    async getListOfApplication() {
      console.log("list of applications loaded");
      await api
        .get("/AppPermission")
        .then((response) => {
          this.listOfApplication = response.data;
          console.log("test", this.listOfApplication);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getListOfApplication();
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
.folder {
  display: inline-block;
  width: 1px;
  margin: 1rem;
  color: #f3a515;
}

.tableContent {
  max-height: calc(82vh - 32px);
  overflow: auto;
}
.folder-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: yellow;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.bodyContent {
  padding-top: 0.5rem;
}
.newButton {
  text-align: end;
}
</style>
