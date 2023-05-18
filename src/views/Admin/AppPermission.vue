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
            Apps
          </div>
        </el-col>
      </el-row>

      <div class="bodyContent">
        <div class="tableContent">
          <div style="text-align: right">
            <el-select
              v-model="form.applicationName"
              placeholder="Add App"
              size="medium"
              :style="{ width: '100px' }"
            >
              <el-option
                v-for="applicationName in filteredAppPermission"
                :key="applicationName.id"
                :label="applicationName"
              >
              </el-option>
            </el-select>
          </div>

          <el-table
            :data="listOfAppPermission"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column label="Application Name" prop="applicationName" />
            <el-table-column align="right">
              <template #default="scope">
                <el-button size="small" @click="handleShowInfo(scope.row)"
                  >Info</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="handleAction('delete', scope.row)"
                  >Remove</el-button
                >
                <el-switch
                  v-model="value6"
                  class="ml-2"
                  width="60"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                  inline-prompt
                  active-text="Active"
                  inactive-text="Suspend"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <!-- Dialog -->
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import appId from "@/configuration/appStore";

export default defineComponent({
  name: "AppPermission, Section, FileRestrictions",
  data() {
    return {
      listOfAppPermission: null,
      infoFormVisible: false,
      listOfSections: null,
      sectionVisible: false,
      listOfFileRestrictions: null,

      form: reactive({
        //AppPermission Properties
        appId: null,
        isActive: "",
        applicationName: "",
        referralUrl: "",
        // Properties

        sectionId: null,
        sectionName: "",

        maxFileSize: "",
        resWidth: "",
        resHeight: "",
        width: "",
        height: "",
      }),
    };
  },
  methods: {
    async getAppPermission() {
      await api.get("/AppPermission").then((response) => {
        this.listOfAppPermission = response.data;
        console.log(this.listOfAppPermission);
      });
    },
  },

  created() {
    this.getAppPermission();
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
//
</style>
