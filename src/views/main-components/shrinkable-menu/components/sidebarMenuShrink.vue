<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer  placement="right-start" :key="index" @on-click="changeMenu">
                    <div style="width: 70px;margin-left: -5px;padding:10px 0;cursor:pointer" type="text">
                          <i class="ivu-icon">
                           <icon :name="item.menuIcon" :scale="1.5"></icon>
                         </i>
                    </div>
                    <DropdownMenu  slot="list">
                        <template  v-for="(child, i) in item.childrenResource">
                            <DropdownItem v-if="child.childrenResource.length<1" :name="child.menuUrl" :key="i"><Icon :type="child.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                            <Dropdown transfer v-else-if="child.childrenResource.length>=1" :key="i" placement="right-start">
                                        <DropdownItem>
                                        <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                                        <!-- <Icon type="ios-arrow-right"></Icon> -->
                                        <Icon type="ios-arrow-forward" />
                                       </DropdownItem>
                                        <DropdownMenu slot="list">
                                             <template v-for="(childThree, j) in child.childrenResource">
                                             <DropdownItem :name="childThree.menuUrl" :key="j"><Icon :type="childThree.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(childThree) }}</span></DropdownItem>
                                            </template>
                                        </DropdownMenu>
                        　 </Dropdown>
                           <template v-if="child.childrenResource.length>=1">
                              <br>
                           </template>
                        </template>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
          　return item.resourceName;
        }
    },
    mounted(){
              
    }
};
</script>
