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
        <!-- <el-col :span="5" class="text-right">
          <div class="newButton">
            <el-button type="primary" @click="showPlanTemplateDialog('New')">
              New Button
            </el-button>
          </div>
        </el-col> -->
      </el-row>
      <!-- Top Level Menu -->

      <!-- Content -->

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
                <!-- Main Content  -->
                <el-icon><TrendCharts /></el-icon>
              </el-scrollbar>
            </div>

            <el-empty description="Selected plan template is empty"> </el-empty>
          </div>
          <!-- Grid or Table -->

          <!-- Emptry State Summary -->
          <el-empty description="Please select a template to view"> </el-empty>
          <!-- Emptry State Summary -->
        </div>
      </div>

      <!-- Content -->
    </el-card>
    <!-- Dialog -->
    <!-- Dialog -->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import api from "@/services/apiService";
import { ElMessage } from "element-plus";
import { Folder } from "@element-plus/icons";

export default defineComponent({
  name: "LastMilePlanTemplate",
  components: {
    Folder,
  },
  data() {
    return {};
  },
  methods: {},
  created() {
    // this.updateData();
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
