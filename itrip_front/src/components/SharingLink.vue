<template>
    <el-dropdown ref="dropdown" placement="bottom-start" trigger="click" @click.native="$emit('shareTrip')">
        <span class="el-dropdown-link">
            <i title="分享" id="share" class="fas fa-share-square" style="color:#8a8d91;cursor:pointer;"></i> 
        </span>
        <el-dropdown-menu slot="dropdown">
            <social-sharing
            @open="$emit('shareTrip')"
            description="跟著IG粉絲一起玩!" 
            :url="shareUrl"
            inline-template>
                <div class="social-div">
                    <el-dropdown-item :disabled="shareId===undefined">
                        <network network="facebook">
                        <i class="fab fa-facebook-square"></i> Facebook
                        </network>
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="shareId===undefined">
                        <network network="twitter">
                        <i class="fab fa-twitter"></i> Twitter
                        </network>  
                    </el-dropdown-item>
                </div>
            </social-sharing>
        </el-dropdown-menu>         
    </el-dropdown>    
</template>

<script>
export default {
  name: "SharingLink",
  props: ['shareUrl', 'shareId'],
}
</script>

<style scoped>
.fa-share-square {
        font-size:25px;
    }
@media only screen and (max-width: 1200px) {
    .fa-share-square {
        font-size:15px;
    }
}
</style>

