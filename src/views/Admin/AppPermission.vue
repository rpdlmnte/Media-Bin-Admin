<template>
  <div>
    <!-- Body Card -->
    <el-card shadow="hover" class="menuCard">
      <!-- Top Level Menu -->
      <el-row class="item">
        <el-col class="titleHeader" :span="5">
          <div
            :style="`font-size: var(--el-font-size-extra-large); text-align: left`"
          >
            Admin User Management
          </div>
        </el-col>
        <el-col :span="5" class="text-right"> </el-col>
      </el-row>
      <!-- Top Level Menu -->

      <!-- Content -->
      <el-skeleton :loading="loading" animated :count="1" :throttle="500">
        <template #default>
          <div>
            <!-- Insert Grid here -->
            <div v-if="errorLoading === false">
              <!-- Display Control Area -->
              <el-row>
                <!-- Display Controls -->
              </el-row>
              <!-- Display Control Area -->

              <!-- Grid or Table  Add Logic on DIV-->
              <div class="bodyContent">
                <!-- Grid or Table  Empty Data Logic Handler on DIV -->
                <div class="tableContent">
                  <el-scrollbar always>
                    <el-table
                      :data="listOfApplications"
                      style="width: 100%"
                      v-loading="loading"
                    >
                      <el-table-column label="Application Name" prop="name" />
                      <el-table-column
                        label="Application Link"
                        prop="appLink"
                      />
                      <el-table-column align="right">
                        <template #default="scope">
                          <el-button
                            size="small"
                            type="primary"
                            @click="handleRemoveGrant(scope.row)"
                            >Grant Access</el-button
                          >
                          <el-button
                            size="small"
                            type="danger"
                            @click="handleRemoveGrant(scope.row)"
                            >Remove Grant</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- Main Content  -->
                  </el-scrollbar>
                </div>
              </div>
              <!-- Grid or Table -->

              <!-- Emptry State Summary -->
              <!-- Emptry State Summary -->
            </div>

            <!-- Error Loading Empty state -->
            <el-empty description="Error loading " v-else>
              <el-button>Reload Table</el-button>
            </el-empty>
            <!-- Error Loading Empty state -->
          </div>
        </template>
      </el-skeleton>
      <!-- Content -->
    </el-card>

    <!-- Dialog -->
    <!-- Grant User Dialog -->
    <el-dialog
      v-model="grantApplicationVisible"
      title="Grant Acces"
      @keydown.esc="clearForm()"
    >
      Are you sure you want to grant access to this application?
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clearForm()">Cancel</el-button>
          <el-button type="primary" @click="grantApplication()"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- Grant User Dialog -->

    <!-- Delete Dialog -->
    <el-dialog v-model="removeGrantVisible" title="Warning" width="30%" center>
      <span text-align="center"
        >Are you sure you already replied to this inquirer?</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="removeGrantVisible = false">Cancel</el-button>
          <el-button type="primary" @click="grantApplication()"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- Delete Dialog -->
    <!-- Dialog -->
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import { mockApplicationList } from "@/mockApplicationsList.js";

export default defineComponent({
  name: "User",
  data() {
    return {
      loading: false,
      errorLoading: false,
      listOfApplications: mockApplicationList,
      listOfGrantedApplications: null,
      grantApplicationVisible: false,
      removeGrantVisible: false,
      selectedUserId: "",

      form: reactive({
        //MediaSliderManager Properties
        id: "",
        firstName: "",
        lastName: "",
        email: "",
      }),
    };
  },
  computed: {
    filteredApplications() {
      return this.listOfApplications.filter((application) => {
        // check if the user has been granted access
        const grantedApplication = this.listOfGrantedApplications.find(
          (active) => active.appId === application.appID,
        );
        return !grantedApplication || !grantedApplication.isActive;
      });
    },
    ...mapGetters({
      user: "returnUserRole",
      oidcUser: "oidcStore/oidcUser",
    }),
  },
  methods: {
    async clearForm() {
      this.grantApplicationVisible = false;
      this.form = {
        appID: "",
        name: "",
        appLink: "",
      };
    },

    async getGrantedApplications() {
      this.loading = true;
      await api
        .get("AppPermission")
        .then((response) => {
          this.listOfGrantedApplications = response.data;
        })
        .catch((error) => {
          ElMessage.error("Failed to retrieve data from the server.");
          console.error(error);
        });
      this.loading = false;
    },
    async grantApplication() {
      const selectedUserId = this.form.id;
      const selectedUser = this.listOfApplications.find(
        (user) => user.id === selectedUserId,
      );
      const payload = {
        appId: this.form.appID,
        referralUrl: this.form.appLink,
        applicationName: this.form.name,
      };
      console.log("payload", payload);
      try {
        await api.post("AppPermission", payload);
        this.grantApplicationVisible = false;
        this.getGrantedApplications();
        ElMessage.success("Application successfully granted access.");
      } catch (error) {
        ElMessage.error("Error adding grant.");
      }
    },

    handleRemoveGrant(row) {
      this.removeGrantVisible = true;
      this.form = row;
    },

    async checkExistingUserDb() {
      const selectedApplicationId = this.form.id;
      const selectedApplication = this.listOfApplications.find(
        (user) => user.id === selectedApplicationId,
      );
      await api
        .get(`AppPermission/CheckApplication/${selectedApplication.id}`)
        .then((response) => {
          if (response.data.isActive === false) {
            this.restoreGrant(response.data.id);
          } else {
            this.grantUser();
          }
          this.clearForm();
        })
        .catch((error) => {
          ElMessage.error("Failed to retrieve user data from the server.");
          console.error(error);
          this.clearForm();
        });
    },

    async removeGrant() {
      await api
        .patch(`AdminUserManagement/RemoveGrant/${this.selectedUserId}`)
        .then(() => {
          ElMessage.success("Grant removed from user!");
          this.getGrantedApplications();
          this.removeGrantVisible = false;
        });
    },

    async restoreGrant(id) {
      await api.patch(`AdminUserManagement/RestoreGrant/${id}`).then(() => {
        ElMessage.success("Grant added to user!");
        this.getGrantedApplications();
        this.grantApplicationVisible = false;
      });
    },
  },
  created() {
    this.getGrantedApplications();
  },
});
</script>

<style>
.my-autocomplete {
  width: 100%;
}

.pac-container {
  z-index: 9999;
  position: absolute;
  width: 100%;
}

.tox .tox-notification--error {
  display: none !important;
}

.tox-tinymce-aux {
  z-index: 5000 !important;
}

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
