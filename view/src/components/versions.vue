<template>
  <div class="commit-list">
    <el-table :data="props.versions" style="width: 100%">
      <el-table-column prop="author_name" label="Author_Name" width="120" show-overflow-tooltip>
        <template #default="scope">
          <div class="ellipsis">
            <span style="color:#000">{{ scope.row.author_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="author_email" label="Author_Email" width="200" show-overflow-tooltip>
        <template #default="scope">
          <div class="ellipsis">
            <span style="color:#409EFF">{{ scope.row.author_email }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="Date" width="200">
        <template #default="scope">
          <span style="color:#888">{{ dateFormat('YY-mm-dd HH:MM:SS', scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="Message" show-overflow-tooltip>
        <template #default="scope">
          <div class="ellipsis">
            <span>{{ scope.row.message }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang='ts'>
import { dateFormat } from "@/utils/tool";
import { onMounted } from "vue-demi";
import { Version } from "@/interface";
interface Props {
  versions: Version[];
}
const props = withDefaults(defineProps<Props>(), {
  versions() {
    return []
  }
})





onMounted(() => {
  console.log(props.versions);
});
</script>



<style lang="scss" scoped>
.commit-list {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background-color: rgba($color: #f5f5f5, $alpha: 0.9);
}
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>