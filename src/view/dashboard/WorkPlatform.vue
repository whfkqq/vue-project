<template>
    <Row :gutter="20">
        <Col :span="15">
            <div class="panel">
                <data-panel></data-panel>
            </div>
            <div class="panel">
                <todo-panel></todo-panel>
            </div>
        </Col>
        <Col :span="9">
            <div class="panel">
                <notice-panel></notice-panel>
            </div>
            <div class="panel">
                <weather-panel></weather-panel>
            </div>
            <div class="panel">
                <shortcut-panel></shortcut-panel>
            </div>
        </Col>
    </Row>
</template>

<script>
import DataPanel from './DataPanel'
import TodoPanel from './TodoPanel'
import NoticePanel from './NoticePanel'
import WeatherPanel from './WeatherPanel'
import ShortcutPanel from './ShortcutPanel'

export default {
    components:
    {
	    DataPanel,
	    TodoPanel,
	    NoticePanel,
	    WeatherPanel,
	    ShortcutPanel
    }

}
</script>

<style>
.panel
{
    margin-top: 15px;
}
</style>