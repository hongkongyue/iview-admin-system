<template>
    <div>
        <staffsamplecoat_add :orderId="$route.params.orderId" pageType="add" type="edit"></staffsamplecoat_add>
    </div>
</template>

<script>
    import staffsamplecoat_add from './template/add'
    export default {
        name: "staffsamplecoat_edit",
        components:{
            staffsamplecoat_add
        }
    }
</script>

<style scoped>

</style>