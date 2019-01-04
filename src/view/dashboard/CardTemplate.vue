<template>
    <div class="block-panel">
        <div class="block-panel__header">
            <div class="block-panel__title" :style="{'background-image':'url(' + panelIcon + ')'}">{{panelTitle}}</div>
            <div class="block-panel__btn">
                <slot name="btn"></slot>
            </div>
        </div>
        <div class="block-panel__content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>

export default 
{
	props:['panelTitle', 'panelIcon']
}
    
</script>

<style>
    .block-panel
    {
        min-height: 220px;
        background-color: #fff;
    }

    .block-panel__header
    {
        padding-left: 20px;
        padding-top: 0px;
        height: 56px;
        line-height: 56px;
        border-bottom: 1px solid #f2f2f2;
        font-size: 16px;
    }

    .block-panel__title
    {
        float: left;
        padding-left:35px;
        background:  no-repeat left center;
    }

    .block-panel__btn
    {
        float: right;
        padding-right: 20px;
    }


    .block-panel__content
    {
        /*padding-left:20px;*/
        min-height: 160px;
    }

</style>