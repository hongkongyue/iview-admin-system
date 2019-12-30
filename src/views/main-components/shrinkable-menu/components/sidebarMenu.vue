<style lang="less">
    .ivu-shrinkable-menu {
        height: 100%;
        width: 100%;

        .ivu-menu {
            color: white;
        }

        .ivu-menu-vertical .ivu-menu-item:hover,
        .ivu-menu-vertical .ivu-menu-submenu-title:hover {
            background: #000000;
            opacity: 0.2;
        }

        .ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        color: #2d8cf0;
        background: transparent
        }
    }
</style>

<template>
    <Menu  ref="sideMenu" :active-name="$route.menuUrl" :open-names="openNames" style="background:transparent;color:white;" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.childrenResource.length<1" :name="item.menuUrl" :key="'menuitem' + item.menuUrl">
                <Icon :type="item.menuIcon" :size="iconSize" :key="'menuicon' + item.menuUrl"></Icon>
                <span class="layout-text" :key="'title' + item.menuUrl">{{ itemTitle(item) }}</span>
                 <!-- <a  target="_blank"  style="margin-left:35px; color:#fff"  class="layout-text"   :href="'http://'+host+'/'+item.menuUrl+params">{{ itemTitle(item) }}</a> -->
            </MenuItem>

            <Submenu v-if="item.childrenResource.length>=1" :name="item.menuUrl" :key="item.menuUrl">
                <template slot="title">
                    <i class="ivu-icon">
                     <icon :name="item.menuIcon" :scale="1.2"></icon>
                    </i>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.childrenResource">
                    <MenuItem v-if="child.childrenResource.length<=0" :name="child.menuUrl" :key="'menuitem' + child.menuUrl">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.menuUrl"></Icon>
                        <span style="margin-left:20px" class="layout-text" :key="'title' + child.menuUrl">{{ itemTitle(child) }}</span>
                        <!-- <a  target="_blank"  style="margin-left:35px; color:#fff"  class="layout-text"   :href="'http://'+host+'/'+item.menuUrl+'/'+child.menuUrl+params">{{ itemTitle(child) }}</a> -->
                    </MenuItem>

                    <Submenu v-else-if="child.childrenResource.length>=1" :name="child.menuUrl" :key="child.menuUrl">
                         <template slot="title">
                              <Icon :type="child.icon" :size="iconSize"></Icon>
                             <span style="margin-left:20px" class="layout-text">{{ itemTitle(child) }}</span>
                         </template>
                         <template v-for="child2 in child.childrenResource">
                          <MenuItem :name="child2.menuUrl" :key="'menuitem'+child2.menuUrl">
                           <Icon :type="child2.icon" :size="iconSize" :key="'icon' + child2.menuUrl"></Icon>
                           <span  style="margin-left:35px" class="layout-text" :key="'title' + child2.menuUrl">{{ itemTitle(child2) }}</span>
                           <!-- <a   target="_blank"  style="margin-left:35px; color:#fff"  class="layout-text"   :href="'http://'+host+'/'+item.menuUrl+'/'+child2.menuUrl+params">{{ itemTitle(child2) }}</a> -->
                          </MenuItem>
                    </template>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    data(){
          return{
                host:'',
                params:'',
          }
    },
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
           return item.resourceName;
        },
    },
    mounted () {
        this.params='?share=1&account='+window.localStorage.getItem('userAccount')+'&pas='+window.localStorage.getItem('password')
        if(window.location.origin.includes('localhost:8080')){
            this.host='localhost:8090'
        }else if(window.location.origin.includes('eopsit.eptison.com')){
            this.host='eopsit.eptison.com:8081'
        }else if(window.location.origin.includes('eopuat.eptison.com')){
            this.host='eopuat.eptison.com'
        }else if(window.location.origin.includes('eop.eptison.com')){
            this.host='eop.eptison.com'
        }
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
