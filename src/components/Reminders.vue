<template>
    <div>
        <p>The Reminders Page</p>
        <div>{{ this.$store.state.todayEvents }}</div>
        <div>{{ this.$store.state.tmrwEvents }}</div>
    </div>
</template>