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
                <el-button
                  size="small"
                  type="primary"
                  @click="handleShowInfo(scope.row)"
                  round
                  >Info</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click="handleAction('delete', scope.row)"
                  >Delete</el-button
                >
                <el-switch
                  v-model="value"
                  size="small"
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
    <el-dialog v-model="infoFormVisible" :title="AppSections" align="right">
      <el-button type="primary" @click="sectionVisible = true">
        Add Section
      </el-button>

      <el-form-item label="Name: " :label-width="formLabelWidth">
        <span>{{ form.applicationName }}</span>
      </el-form-item>
      <el-form-item label="appId: " :label-width="formLabelWidth">
        <span>{{ form.appId }}</span>
      </el-form-item>
      <el-form-item label="referralUrl: " :label-width="formLabelWidth">
        <span>{{ form.referralUrl }}</span>
      </el-form-item>
    </el-dialog>
    <!-- ADD SECTION DIALOG -->
    <el-dialog
      v-model="sectionVisible"
      title="Add Section"
      @keydown.esc="clearform()"
    >
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "AppPermission, Section",
  data() {
    return {
      listOfAppPermission: null,
      infoFormVisible: false,
      listOfSections: null,
      sectionVisible: false,
      // selectedSectionName: "",

      form: reactive({
        //AppPermission Properties
        appId: null,
        isActive: "",
        applicationName: "",
        referralUrl: "",
        // Properties

        sectionId: null,
        sectionName: "",
      }),
    };
  },
  // computed: {
  //   filteredSections() {
  //     return this.listOfSections.filter((sectionName) => {
  //       const listOfSections = this.listOfSections.find(
  //         (section) => sectionName == section.name,
  //       );
  //       return !listOfSections || !listOfSections.sectionName;
  //     });
  //   },
  // },
  methods: {
    async getAppPermission() {
      await api.get("/AppPermission").then((response) => {
        this.listOfAppPermission = response.data;
        console.log(this.listOfAppPermission);
      });
    },
    async getSection() {
      await api.get("/Section").then((response) => {
        this.listOfSections = response.data;
        console.log(this.listOfSections);
      });
    },

    handleShowInfo(row) {
      this.infoFormVisible = true;
      this.form = row;
      console.log(this.infoFormVisible);
    },
  },

  created() {
    this.getAppPermission();
    this.getSection();
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
