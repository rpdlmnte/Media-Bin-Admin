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
    <el-dialog v-model="infoFormVisible" :title="AppSections" align="right">
      <el-button type="primary" @click="sectionVisible = true">
        Add Section
      </el-button>

      <el-form-item label="Name: " :label-width="formLabelWidth">
        <span>{{ form.applicationName }}</span>
      </el-form-item>
      <el-table :data="listOfSections" style="width: 100%" v-loading="loading">
        <el-table-column label="Section Name" prop="sectionName">
          <template v-slot="scope">
            <el-collapse v-model="scope.row.isExpanded">
              <el-collapse-item>
                <template v-slot:title>
                  <span>{{ scope.row.sectionName }}</span>
                </template>
                <el-row>
                  <el-col align="right">
                    <el-button size="small" @click="handleShowInfo(scope.row)">
                      Edit
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleAction('delete', scope.row)"
                    >
                      Delete
                    </el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="handleShowInfo(scope.row)"
                    >
                      Add Restriction
                    </el-button>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- ADD SECTION DIALOG -->
    <el-dialog
      v-model="sectionVisible"
      title="Enter Section Name"
      @keydown.esc="clearform()"
    >
      <!-- <span>{{ form.sectionName }}</span> -->
      <el-form :model="form">
        <el-form-item label="Section Name: " :label-width="formLabelWidth">
          <el-input v-model="form.sectionName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="clearForm()">Close</el-button> -->
          <el-button type="primary" @click="createSection(form)"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
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
    async createSection(form) {
      console.log(form);
      const formData = {
        appId: form.appId,
        sectionName: form.sectionName,
      };
      // formData.append("appId", form.appId);
      // formData.append("sectionName", form.sectionName);
      console.log(formData);
      await api
        .post("Section", formData)
        .then(() => {
          ElMessage.success("Section Created Successfuly!");
          this.sectionVisible = false;
        })
        .catch(() => {
          ElMessage.error("test");
        });
    },
    async getAppPermission() {
      await api.get("/AppPermission").then((response) => {
        this.listOfAppPermission = response.data;
        console.log(this.listOfAppPermission);
      });
    },
    async getSection(appId) {
      await api.get(`Section/${appId}`).then((response) => {
        this.listOfSections = response.data;
        console.log(this.listOfSections);
      });
    },
    async getFileRestrictions(sectionId) {
      await api.get(`FileRestrictions/${sectionId}`).then((response) => {
        this.listOfFileRestrictions = response.data;
        console.log(this.listOfFileRestrictions);
      });
    },

    handleShowInfo(row) {
      this.infoFormVisible = true;
      this.form = row;
      this.getSection(row.appId);
      // console.log(this.infoFormVisible);
    },
  },

  created() {
    this.getAppPermission();
    this.getSection();
    this.getFileRestrictions();
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
