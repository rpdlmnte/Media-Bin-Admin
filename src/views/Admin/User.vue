<script>
import { defineComponent, reactive } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";

import appId from "@/configuration/appStore";

export default defineComponent({
  name: "User",
  data() {
    return {
      inputValue: "",
      loading: false,
      errorLoading: false,
      listOfUsers: null,
      listOfGrantedUsers: null,
      grantUserVisible: false,
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
    filteredUsers() {
      if (!this.inputValue) {
        return this.listOfUsers;
      }
      const searchValue = this.searchValue.toLoweCase();
      return this.listOfUsers.filter((user) => {
        // Filter out granted users
        const grantedUser = this.listOfGrantedUsers.find(
          (granted) => granted.id === user.id,
          user.Name.toLoweCase().includes(searchValue),
        );
        return !grantedUser || !grantedUser.isActive;
      });
    },
    ...mapGetters({
      user: "returnUserRole",
      oidcUser: "oidcStore/oidcUser",
    }),
  },
  methods: {
    async clearForm() {
      this.grantUserVisible = false;
      this.form = {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
      };
    },
    hadleSearchInputChange(value) {
      this.inputValue = value;
    },
    async getListOfUsers() {
      await api
        .get("https://users.test.skanlog.com/api/v1/users")
        .then((response) => {
          const users = response.data.map((user) => {
            return {
              ...user,
              fullName: `${user.firstName} ${user.lastName}`,
            };
          });
          this.listOfUsers = users;
        })
        .catch((error) => {
          ElMessage.error("Failed to retrieve data from the server.");
          console.error(error);
        });
    },

    async getGrantedUsers() {
      this.loading = true;
      await api
        .get("/AdminUserManagement")
        .then((response) => {
          this.listOfGrantedUsers = response.data;
        })
        .catch((error) => {
          ElMessage.error("Failed to retrieve data from the server.");
          console.error(error);
        });
      this.loading = false;
    },
    async grantUser() {
      const selectedUserId = this.form.id;
      const selectedUser = this.listOfUsers.find(
        (user) => user.id === selectedUserId,
      );
      const payload = {
        id: selectedUser.id,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
      };
      try {
        await api.post("/AdminUserManagement/", payload);
        this.grantUserVisible = false;
        this.getGrantedUsers();
        ElMessage.success("User successfully granted access.");
      } catch (error) {
        ElMessage.error("Error adding grant.");
      }
    },

    handleRemoveGrant(row) {
      this.removeGrantVisible = true;
      this.selectedUserId = row.id;
    },

    async checkExistingUserDb() {
      const selectedUserId = this.form.id;
      const selectedUser = this.listOfUsers.find(
        (user) => user.id === selectedUserId,
      );
      await api
        .get(`/AdminUserManagement/CheckUser/${selectedUser.id}`)
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
          this.getGrantedUsers();
          this.removeGrantVisible = false;
        });
    },

    async restoreGrant(id) {
      await api.patch(`AdminUserManagement/RestoreGrant/${id}`).then(() => {
        ElMessage.success("Grant added to user!");
        this.getGrantedUsers();
        this.grantUserVisible = false;
      });
    },
  },
  created() {
    this.getListOfUsers();
    this.getGrantedUsers();
  },
  // async mounted() {
  //   const userID = this.oidcUser.sub;
  //    await this.$store.dispatch("getUserRole", userID);
  // },
});
</script>

<template>
  <div>
    <!-- Body Card -->
    <el-card shadow="hover" class="menuCard">
      <!-- Top Level Menu -->
      <el-row class="item">
        <el-col class="titleHeader" :span="10">
          <div
            :style="`font-size: var(--el-font-size-extra-large); text-align: left`"
          >
            Admin User Management
          </div>
        </el-col>
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
                      :data="listOfUsers"
                      style="width: 100%"
                      v-loading="loading"
                    >
                      <el-table-column label="First Name" prop="firstName" />
                      <el-table-column label="Last Name" prop="lastName" />
                      <el-table-column label="Email" prop="email" />
                      <el-table-column align="right">
                        <template #header>
                          <el-input
                            class="w-50 m-2"
                            size="small"
                            placeholder="Type to search user"
                            :suffix-icon="Search"
                            v-model="inputValue"
                            @input="handleSearchInputChange"
                          />
                        </template>
                        <template #default="scope">
                          <!-- <el-button
                            size="small"
                            type="danger"
                            @click="handleRemoveGrant(scope.row)"
                            >Ungrant</el-button
                          > -->
                          <el-button
                            size="small"
                            type="primary"
                            @click="handeGrantUser(scope.row)"
                            >Grant User</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-scrollbar>
                </div>
              </div>
              <!-- Grid or Table -->
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
    <!-- Delete Dialog -->
    <el-dialog v-model="removeGrantVisible" title="Warning" width="30%" center>
      <span text-align="center"
        >Are you sure you already replied to this inquirer?</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="removeGrantVisible = false">Cancel</el-button>
          <el-button type="primary" @click="removeGrant()">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- Delete Dialog -->
    <!-- Dialog -->
  </div>
</template>

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
/* .el-input {
  weight: 24px;
  line-height: 24px;
  padding: 0 7px;
} */
.bodyContent {
  padding-top: 0.5rem;
}
.newButton {
  text-align: end;
}
</style>
